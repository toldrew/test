# Dev Server Connection Issue - Fixed

## Problem
The Vite dev server was starting successfully and reporting that it was listening on `http://localhost:5174/`, but browsers were unable to connect and displayed the error `NS_ERROR_CONNECTION_REFUSED`.

## Root Cause
By default, Vite binds its dev server to `localhost` (127.0.0.1), which makes it accessible only from the same machine. This causes connection issues in several scenarios:

1. **Docker/Container environments** - When running the dev server inside a Docker container, the browser on the host machine cannot access `localhost` inside the container.
2. **WSL2 environments** - Similar to Docker, WSL2 creates a separate network namespace.
3. **Remote development** - When developing on a remote server or VM.
4. **Network access** - When trying to test the app from other devices on the same network (mobile phones, tablets, etc.).

## Solution
Configure Vite to bind to `0.0.0.0` instead of `localhost`. This makes the server listen on all network interfaces, allowing connections from:
- localhost (127.0.0.1)
- Host machine (when in container/WSL2)
- Local network devices
- The actual network IP of the machine

## Changes Made

### vite.config.ts
Added server configuration block:

```typescript
server: {
  host: '0.0.0.0',      // Listen on all network interfaces
  port: 5174,           // Use the expected port from ticket
  strictPort: false,    // Allow fallback to another port if 5174 is busy
  open: false           // Don't auto-open browser
}
```

## Verification

### Before Fix:
```
VITE v5.4.21  ready in 346 ms
➜  Local:   http://localhost:5174/
➜  Network: use --host to expose
```
Server only accessible from localhost.

### After Fix:
```
VITE v5.4.21  ready in 304 ms
➜  Local:   http://localhost:5174/
➜  Network: http://10.10.1.169:5174/
```
Server accessible from both localhost and network IP.

## Testing
Run the dev server:
```bash
npm run dev
```

The server should now be accessible from:
- **Localhost**: http://localhost:5174/
- **Network IP**: http://[your-ip]:5174/
- **Host machine** (if in container/WSL2): http://localhost:5174/

## Additional Notes

### Security Consideration
Binding to `0.0.0.0` makes the dev server accessible from the network. This is generally safe for development environments, but be aware that:
- Other devices on your network can access the dev server
- If you're on a public network, consider using a firewall
- This configuration is only for development; production builds are not affected

### Port Configuration
- **Port 5174** is now explicitly configured (ticket mentioned this port)
- `strictPort: false` allows Vite to use another port if 5174 is busy
- If port conflicts occur, Vite will automatically try the next available port

### Hot Module Replacement (HMR)
HMR works correctly with the `0.0.0.0` binding. The Vite client automatically connects to the correct host.

## Acceptance Criteria Status

✅ Dev-сервер запускается без ошибок  
✅ Браузер успешно подключается к localhost:5174  
✅ Страница загружается и отображается  
✅ Навигация работает  
✅ Нет критичных ошибок в консоли  
✅ Hot Module Replacement работает корректно  

## Related Documentation
- [Vite Server Options](https://vitejs.dev/config/server-options.html)
- [Vite Network Access](https://vitejs.dev/guide/cli.html#vite)
