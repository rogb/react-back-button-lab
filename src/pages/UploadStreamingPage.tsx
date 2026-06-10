import {
  Alert,
  Box,
  Button,
  LinearProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import PageCard from "../components/PageCard";

type UploadStatus = "idle" | "uploading" | "success" | "error" | "cancelled";

type UploadResult = {
  fileName?: string;
  fileSize?: number;
  savedTo?: string;
  error?: string;
  details?: string;
};

const nodeRedOrigin = "http://localhost:1880";
const endpointOptions = [
  `${nodeRedOrigin}/api/true-stream-upload`,
  `${nodeRedOrigin}/api/stream-upload`,
  `${nodeRedOrigin}/api/stream-upload-memory`,
];
const defaultEndpointBase = endpointOptions[0];

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 bytes";
  }

  const units = ["bytes", "KB", "MB", "GB", "TB"];
  const unitIndex = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / 1024 ** unitIndex;

  if (unitIndex === 0) {
    return `${bytes} bytes`;
  }

  return `${value.toFixed(value >= 10 ? 1 : 2)} ${units[unitIndex]}`;
}

function resolveEndpointBase(endpointBase: string) {
  const trimmedEndpointBase = endpointBase.trim().replace(/\/+$/, "");

  if (trimmedEndpointBase.startsWith("/")) {
    return `${nodeRedOrigin}${trimmedEndpointBase}`;
  }

  return trimmedEndpointBase;
}

export default function UploadStreamingPage() {
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [endpointBase, setEndpointBase] = useState(defaultEndpointBase);
  const [uploadedBytes, setUploadedBytes] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<UploadResult | null>(null);

  const progressPercent =
    totalBytes > 0 ? Math.min(100, (uploadedBytes / totalBytes) * 100) : 0;
  const isUploading = status === "uploading";

  useEffect(() => {
    setEndpointBase((currentEndpointBase) =>
      currentEndpointBase.trim() === "/api/stream-upload"
        ? defaultEndpointBase
        : currentEndpointBase,
    );
  }, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    setSelectedFile(file);
    setUploadedBytes(0);
    setTotalBytes(file?.size ?? 0);
    setStatus("idle");
    setMessage("");
    setResult(null);
  };

  const handleUpload = () => {
    if (!selectedFile || isUploading) {
      return;
    }

    const url = `${resolveEndpointBase(endpointBase)}/${encodeURIComponent(
      selectedFile.name,
    )}`;
    const xhr = new XMLHttpRequest();

    xhrRef.current = xhr;
    setStatus("uploading");
    setMessage("");
    setResult(null);
    setUploadedBytes(0);
    setTotalBytes(selectedFile.size);

    xhr.upload.onprogress = (event) => {
      console.log("Upload progress event:", event);
      setUploadedBytes(event.loaded);

      if (event.lengthComputable) {
        setTotalBytes(event.total);
      }
    };

    xhr.onload = () => {
      xhrRef.current = null;
      setUploadedBytes(selectedFile.size);

      let parsedResult: UploadResult | null = null;

      try {
        parsedResult = xhr.responseText
          ? (JSON.parse(xhr.responseText) as UploadResult)
          : null;
      } catch {
        parsedResult = { details: xhr.responseText };
      }

      setResult(parsedResult);

      if (xhr.status >= 200 && xhr.status < 300) {
        setStatus("success");
        setMessage("Upload complete.");
      } else {
        setStatus("error");
        setMessage(`Upload failed with HTTP ${xhr.status}.`);
      }
    };

    xhr.onerror = () => {
      xhrRef.current = null;
      setStatus("error");
      setMessage("Upload failed before the server returned a response.");
    };

    xhr.onabort = () => {
      xhrRef.current = null;
      setStatus("cancelled");
      setMessage("Upload cancelled.");
    };

    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/octet-stream");
    xhr.setRequestHeader("X-Filename", selectedFile.name);
    xhr.send(selectedFile);
  };

  const handleCancel = () => {
    xhrRef.current?.abort();
  };

  return (
    <PageCard title="Upload Streaming">
      <Stack spacing={2.5}>
        <TextField
          select
          label="Node-RED endpoint base"
          value={endpointBase}
          onChange={(event) => setEndpointBase(event.target.value)}
          size="small"
          helperText="The selected filename is appended to this path."
          disabled={isUploading}
          fullWidth
        >
          {endpointOptions.map((endpoint) => (
            <MenuItem key={endpoint} value={endpoint}>
              {endpoint}
            </MenuItem>
          ))}
        </TextField>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{ alignItems: { xs: "stretch", sm: "center" } }}
        >
          <Button variant="outlined" component="label" disabled={isUploading}>
            Pick file
            <input type="file" hidden onChange={handleFileChange} />
          </Button>

          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography sx={{ overflowWrap: "anywhere" }}>
              {selectedFile ? selectedFile.name : "No file selected"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedFile ? formatBytes(selectedFile.size) : " "}
            </Typography>
          </Box>
        </Stack>

        <Box>
          <LinearProgress
            variant={totalBytes > 0 ? "determinate" : "indeterminate"}
            value={progressPercent}
            sx={{ height: 10, borderRadius: 1 }}
          />
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={0.5}
            sx={{ mt: 0.75, justifyContent: "space-between" }}
          >
            <Typography variant="body2" color="text.secondary">
              {formatBytes(uploadedBytes)} uploaded
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {totalBytes > 0
                ? `${progressPercent.toFixed(1)}% of ${formatBytes(totalBytes)}`
                : "Waiting for file"}
            </Typography>
          </Stack>
        </Box>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading || !endpointBase.trim()}
          >
            Upload
          </Button>
          <Button
            variant="outlined"
            color="warning"
            onClick={handleCancel}
            disabled={!isUploading}
          >
            Cancel
          </Button>
        </Stack>

        {message && (
          <Alert
            severity={
              status === "success"
                ? "success"
                : status === "cancelled"
                  ? "warning"
                  : "error"
            }
          >
            {message}
          </Alert>
        )}

        {result && (
          <Box
            component="pre"
            sx={{
              m: 0,
              p: 1.5,
              borderRadius: 1,
              bgcolor: "#111827",
              color: "#d1d5db",
              fontSize: "0.78rem",
              overflowX: "auto",
            }}
          >
            {JSON.stringify(result, null, 2)}
          </Box>
        )}
      </Stack>
    </PageCard>
  );
}
