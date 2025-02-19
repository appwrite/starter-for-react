import { useState, useRef, useEffect, useCallback } from 'react'
import './App.css'
import { client } from "./lib/appwrite";
import { AppwriteException } from "appwrite";

function App() {
    const [detailHeight, setDetailHeight] = useState(0);
    const [logs, setLogs] = useState([]);
    const [status, setStatus] = useState("idle");
    const [showLogs, setShowLogs] = useState(false);

    const detailsRef = useRef(null);

    const updateHeight = useCallback(() => {
        if (detailsRef.current) {
            setDetailHeight(detailsRef.current.clientHeight);
        }
    }, [logs, showLogs]);

    useEffect(() => {
        updateHeight();
        window.addEventListener("resize", updateHeight);
        return () => window.removeEventListener("resize", updateHeight);
    }, [updateHeight]);

    async function sendPing() {
        if (status === "loading") return;
        setStatus("loading");
        try {
            const result = await client.ping();
            const log = {
                date: new Date(),
                method: "GET",
                path: "/v1/ping",
                status: 200,
                response: JSON.stringify(result),
            };
            setLogs((prevLogs) => [log, ...prevLogs]);
            setStatus("success");
        } catch (err) {
            const log = {
                date: new Date(),
                method: "GET",
                path: "/v1/ping",
                status: err instanceof AppwriteException ? err.code : 500,
                response:
                    err instanceof AppwriteException
                        ? err.message
                        : "Something went wrong",
            };
            setLogs((prevLogs) => [log, ...prevLogs]);
            setStatus("error");
        }
        setShowLogs(true);
    }

    return (
        <main
            className="u-flex u-flex-vertical u-padding-20 u-cross-center u-gap-32 checker-background"
            style={{ marginBottom: `${detailHeight}px` }}
        >
            <div className="connection-visual">
                <div className="outer-card">
                    <div className="inner-card">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                             aria-hidden="true" role="img" className="iconify iconify--logos" width="35.93" height="32"
                             preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 228">
                            <path fill="#00D8FF"
                                  d="M210.483 73.824a171.49 171.49 0 0 0-8.24-2.597c.465-1.9.893-3.777 1.273-5.621c6.238-30.281 2.16-54.676-11.769-62.708c-13.355-7.7-35.196.329-57.254 19.526a171.23 171.23 0 0 0-6.375 5.848a155.866 155.866 0 0 0-4.241-3.917C100.759 3.829 77.587-4.822 63.673 3.233C50.33 10.957 46.379 33.89 51.995 62.588a170.974 170.974 0 0 0 1.892 8.48c-3.28.932-6.445 1.924-9.474 2.98C17.309 83.498 0 98.307 0 113.668c0 15.865 18.582 31.778 46.812 41.427a145.52 145.52 0 0 0 6.921 2.165a167.467 167.467 0 0 0-2.01 9.138c-5.354 28.2-1.173 50.591 12.134 58.266c13.744 7.926 36.812-.22 59.273-19.855a145.567 145.567 0 0 0 5.342-4.923a168.064 168.064 0 0 0 6.92 6.314c21.758 18.722 43.246 26.282 56.54 18.586c13.731-7.949 18.194-32.003 12.4-61.268a145.016 145.016 0 0 0-1.535-6.842c1.62-.48 3.21-.974 4.76-1.488c29.348-9.723 48.443-25.443 48.443-41.52c0-15.417-17.868-30.326-45.517-39.844Zm-6.365 70.984c-1.4.463-2.836.91-4.3 1.345c-3.24-10.257-7.612-21.163-12.963-32.432c5.106-11 9.31-21.767 12.459-31.957c2.619.758 5.16 1.557 7.61 2.4c23.69 8.156 38.14 20.213 38.14 29.504c0 9.896-15.606 22.743-40.946 31.14Zm-10.514 20.834c2.562 12.94 2.927 24.64 1.23 33.787c-1.524 8.219-4.59 13.698-8.382 15.893c-8.067 4.67-25.32-1.4-43.927-17.412a156.726 156.726 0 0 1-6.437-5.87c7.214-7.889 14.423-17.06 21.459-27.246c12.376-1.098 24.068-2.894 34.671-5.345a134.17 134.17 0 0 1 1.386 6.193ZM87.276 214.515c-7.882 2.783-14.16 2.863-17.955.675c-8.075-4.657-11.432-22.636-6.853-46.752a156.923 156.923 0 0 1 1.869-8.499c10.486 2.32 22.093 3.988 34.498 4.994c7.084 9.967 14.501 19.128 21.976 27.15a134.668 134.668 0 0 1-4.877 4.492c-9.933 8.682-19.886 14.842-28.658 17.94ZM50.35 144.747c-12.483-4.267-22.792-9.812-29.858-15.863c-6.35-5.437-9.555-10.836-9.555-15.216c0-9.322 13.897-21.212 37.076-29.293c2.813-.98 5.757-1.905 8.812-2.773c3.204 10.42 7.406 21.315 12.477 32.332c-5.137 11.18-9.399 22.249-12.634 32.792a134.718 134.718 0 0 1-6.318-1.979Zm12.378-84.26c-4.811-24.587-1.616-43.134 6.425-47.789c8.564-4.958 27.502 2.111 47.463 19.835a144.318 144.318 0 0 1 3.841 3.545c-7.438 7.987-14.787 17.08-21.808 26.988c-12.04 1.116-23.565 2.908-34.161 5.309a160.342 160.342 0 0 1-1.76-7.887Zm110.427 27.268a347.8 347.8 0 0 0-7.785-12.803c8.168 1.033 15.994 2.404 23.343 4.08c-2.206 7.072-4.956 14.465-8.193 22.045a381.151 381.151 0 0 0-7.365-13.322Zm-45.032-43.861c5.044 5.465 10.096 11.566 15.065 18.186a322.04 322.04 0 0 0-30.257-.006c4.974-6.559 10.069-12.652 15.192-18.18ZM82.802 87.83a323.167 323.167 0 0 0-7.227 13.238c-3.184-7.553-5.909-14.98-8.134-22.152c7.304-1.634 15.093-2.97 23.209-3.984a321.524 321.524 0 0 0-7.848 12.897Zm8.081 65.352c-8.385-.936-16.291-2.203-23.593-3.793c2.26-7.3 5.045-14.885 8.298-22.6a321.187 321.187 0 0 0 7.257 13.246c2.594 4.48 5.28 8.868 8.038 13.147Zm37.542 31.03c-5.184-5.592-10.354-11.779-15.403-18.433c4.902.192 9.899.29 14.978.29c5.218 0 10.376-.117 15.453-.343c-4.985 6.774-10.018 12.97-15.028 18.486Zm52.198-57.817c3.422 7.8 6.306 15.345 8.596 22.52c-7.422 1.694-15.436 3.058-23.88 4.071a382.417 382.417 0 0 0 7.859-13.026a347.403 347.403 0 0 0 7.425-13.565Zm-16.898 8.101a358.557 358.557 0 0 1-12.281 19.815a329.4 329.4 0 0 1-23.444.823c-7.967 0-15.716-.248-23.178-.732a310.202 310.202 0 0 1-12.513-19.846h.001a307.41 307.41 0 0 1-10.923-20.627a310.278 310.278 0 0 1 10.89-20.637l-.001.001a307.318 307.318 0 0 1 12.413-19.761c7.613-.576 15.42-.876 23.31-.876H128c7.926 0 15.743.303 23.354.883a329.357 329.357 0 0 1 12.335 19.695a358.489 358.489 0 0 1 11.036 20.54a329.472 329.472 0 0 1-11 20.722Zm22.56-122.124c8.572 4.944 11.906 24.881 6.52 51.026c-.344 1.668-.73 3.367-1.15 5.09c-10.622-2.452-22.155-4.275-34.23-5.408c-7.034-10.017-14.323-19.124-21.64-27.008a160.789 160.789 0 0 1 5.888-5.4c18.9-16.447 36.564-22.941 44.612-18.3ZM128 90.808c12.625 0 22.86 10.235 22.86 22.86s-10.235 22.86-22.86 22.86s-22.86-10.235-22.86-22.86s10.235-22.86 22.86-22.86Z"></path>
                        </svg>
                    </div>
                </div>
                <div
                    className="connection-line"
                    style={{
                        opacity: status === "success" ? 1 : 0,
                        transition: "opacity 2.5s",
                    }}
                >
                    <div className="line-left"></div>
                    <div
                        className="u-flex u-main-center u-border-radius-circle tick-container icon-check"
                        style={{color: "#fd366e"}}
                    ></div>
                    <div className="line-right"></div>
                </div>
                <div className="outer-card">
                    <div className="inner-card">
                        <svg
                            width="72"
                            height="72"
                            viewBox="0 0 72 72"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M71.9999 52.1996V68.3996H31.6713C19.9219 68.3996 9.663 61.8843 4.17426 52.1996C3.37635 50.7917 2.67799 49.3145 2.09218 47.7814C0.942204 44.7771 0.219318 41.5533 0 38.1895V33.8097C0.0476152 33.06 0.122645 32.3163 0.220761 31.5814C0.421322 30.0733 0.724328 28.5977 1.12256 27.1632C4.88994 13.5641 17.14 3.59961 31.6713 3.59961C46.2026 3.59961 58.4512 13.5641 62.2186 27.1632H44.9747C42.1438 22.7303 37.2437 19.7996 31.6713 19.7996C26.0989 19.7996 21.1989 22.7303 18.3679 27.1632C17.5051 28.5108 16.8356 29.9968 16.3969 31.5814C16.0074 32.9864 15.7996 34.468 15.7996 35.9996C15.7996 40.6431 17.7129 44.8286 20.7804 47.7814C23.6229 50.5222 27.4552 52.1996 31.6713 52.1996H71.9999Z"
                                fill="#FD366E"
                            />
                            <path
                                d="M72.0002 31.583V47.783H42.5625C45.6301 44.8302 47.5433 40.6447 47.5433 36.0012C47.5433 34.4696 47.3356 32.988 46.946 31.583H72.0002Z"
                                fill="#FD366E"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            <section
                className="u-flex u-flex-vertical u-main-center u-cross-center u-padding-16"
                style={{backdropFilter: "blur(1px)"}}
            >
                {status === "loading" ? (
                    <div className="u-flex u-cross-center u-gap-16">
                        <div className="loader is-small"></div>
                        <h1 className="heading-level-7">Waiting for connection...</h1>
                    </div>
                ) : status === "success" ? (
                    <h1 className="heading-level-5">Congratulations!</h1>
                ) : (
                    <h1 className="heading-level-5">Check connection</h1>
                )}

                <p className="body-text-2 u-text-center">
                    {status === "success" ? (
                        <span>You connected your app successfully.</span>
                    ) : status === "error" || status === "idle" ? (
                        <span>Send a ping to verify the connection</span>
                    ) : null}
                </p>

                <button
                    onClick={sendPing}
                    className="button u-margin-block-start-32"
                    style={{visibility: status === "loading" ? "hidden" : "visible"}}
                >
                    <span>Send a ping</span>
                </button>
            </section>

            <nav className="u-grid">
                <ul className="u-flex u-flex-wrap u-main-center u-gap-32">
                    <li
                        className="card u-max-width-300 u-flex-vertical u-gap-8"
                        style={{"--p-card-padding": "1em"}}
                    >
                        <h2 className="heading-level-7">Edit your app</h2>
                        <p className="body-text-2">
                            Edit <code className="inline-code">App.jsx</code> to get
                            started with building your app
                        </p>
                    </li>
                    <li
                        className="card u-max-width-300"
                        style={{ "--p-card-padding": "1em" }}
                    >
                        <a
                            href="https://cloud.appwrite.io"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="u-flex-vertical u-gap-8"
                        >
                            <div className="u-flex u-main-space-between u-cross-center">
                                <h2 className="heading-level-7">Head to Appwrite Cloud</h2>
                                <span
                                    className="icon-arrow-right"
                                    style={{ color: "hsl(var(--color-neutral-15))" }}
                                ></span>
                            </div>
                            <p className="body-text-2">
                                Start managing your project from the Appwrite console
                            </p>
                        </a>
                    </li>
                    <li
                        className="card u-max-width-300"
                        style={{ "--p-card-padding": "1em" }}
                    >
                        <a
                            href="https://appwrite.io/docs"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="u-flex-vertical u-gap-8"
                        >
                            <div className="u-flex u-main-space-between u-cross-center">
                                <h2 className="heading-level-7">Explore docs</h2>
                                <span
                                    className="icon-arrow-right"
                                    style={{ color: "hsl(var(--color-neutral-15))" }}
                                ></span>
                            </div>
                            <p className="body-text-2">
                                Discover the full power of Appwrite by diving into our
                                documentation
                            </p>
                        </a>
                    </li>
                </ul>
            </nav>

            <aside
                className="collapsible u-width-full-line u-position-fixed"
                style={{ border: "1px solid hsl(var(--color-neutral-10))", bottom: 0 }}
            >
                <div className="collapsible-item">
                    <details
                        className="collapsible-wrapper u-padding-0"
                        style={{ backgroundColor: "hsl(var(--color-neutral-0))" }}
                        open={showLogs}
                        ref={detailsRef}
                    >
                        <summary className="collapsible-button u-padding-16">
                            <span className="text">Logs</span>
                            {logs.length > 0 && (
                                <span className="collapsible-button-optional">
                  <span className="inline-tag">
                    <span className="text">{logs.length}</span>
                  </span>
                </span>
                            )}
                            <div className="icon">
                                <span className="icon-cheveron-down" aria-hidden="true"></span>
                            </div>
                        </summary>
                        <div className="collapsible-content u-flex u-flex-vertical-mobile u-cross-stretch u-padding-0">
                            <div
                                className="table is-table-row-medium-size u-stretch"
                                style={{ "--p-border-radius": 0, inlineSize: "unset" }}
                            >
                                <div
                                    className="table-thead"
                                    style={{ backgroundColor: "hsl(var(--color-neutral-5))" }}
                                >
                                    <div className="table-row">
                                        <div className="table-thead-col">
                                            <span className="u-color-text-offline">Project</span>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="grid-box u-padding-16"
                                    style={{
                                        "--grid-gap": "2rem",
                                        "--grid-item-size-small-screens": "10rem",
                                        "--grid-item-size": "10rem",
                                        backgroundColor: "hsl(var(--color-neutral-0))",
                                    }}
                                >
                                    <div className="u-grid u-grid-vertical u-gap-8">
                                        <p className="u-color-text-offline">Endpoint</p>
                                        <p className="body-text-2">
                                            {import.meta.env.VITE_APPWRITE_ENDPOINT}
                                        </p>
                                    </div>
                                    <div className="u-grid u-grid-vertical u-gap-8">
                                        <p className="u-color-text-offline">Project ID</p>
                                        <p className="body-text-2">
                                            {import.meta.env.VITE_APPWRITE_PROJECT_ID}
                                        </p>
                                    </div>
                                    <div className="u-grid u-grid-vertical u-gap-8">
                                        <p className="u-color-text-offline">Project name</p>
                                        <p className="body-text-2">
                                            {import.meta.env.VITE_APPWRITE_PROJECT_NAME}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <table
                                className="table is-table-row-small-size"
                                style={{ "--p-border-radius": 0, flex: 2 }}
                            >
                                <thead
                                    className="table-thead"
                                    style={{ backgroundColor: "hsl(var(--color-neutral-5))" }}
                                >
                                <tr
                                    className="table-row u-grid"
                                    style={{
                                        gridTemplateColumns: "3fr 2fr 2fr 2fr 5fr",
                                        minBlockSize: "unset",
                                    }}
                                >
                                    {logs.length > 0 ? (
                                        <>
                                            <th className="table-thead-col">
                                                <span className="u-color-text-offline">Date</span>
                                            </th>
                                            <th className="table-thead-col">
                                                <span className="u-color-text-offline">Status</span>
                                            </th>
                                            <th className="table-thead-col">
                                                <span className="u-color-text-offline">Method</span>
                                            </th>
                                            <th className="table-thead-col">
                                                <span className="u-color-text-offline">Path</span>
                                            </th>
                                            <th className="table-thead-col">
                                                <span className="u-color-text-offline">Response</span>
                                            </th>
                                        </>
                                    ) : (
                                        <th className="table-thead-col" colSpan="5">
                                            <span className="u-color-text-offline">Logs</span>
                                        </th>
                                    )}
                                </tr>
                                </thead>

                                <tbody
                                    className="table-tbody u-flex u-flex-vertical u-font-code u-overflow-y-auto"
                                    style={{ maxHeight: "16em" }}
                                >
                                {logs.length > 0 ? (
                                    logs.map((log, index) => (
                                        <tr
                                            key={index}
                                            className="table-row u-grid u-height-auto"
                                            style={{
                                                gridTemplateColumns: "3fr 2fr 2fr 2fr 5fr",
                                                minBlockSize: "unset",
                                            }}
                                        >
                                            <td
                                                className="table-col u-flex u-cross-center"
                                                data-title="Date"
                                            >
                                                <time className="text">
                                                    {log.date.toLocaleString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </time>
                                            </td>
                                            <td
                                                className="table-col u-flex u-cross-center"
                                                data-title="Status"
                                            >
                          <span
                              className={`tag ${
                                  log.status >= 400 ? "is-warning" : "is-success"
                              }`}
                          >
                            {log.status}
                          </span>
                                            </td>
                                            <td
                                                className="table-col u-flex u-cross-center"
                                                data-title="Method"
                                            >
                                                <span className="text">{log.method}</span>
                                            </td>
                                            <td
                                                className="table-col u-flex u-cross-center"
                                                data-title="Path"
                                            >
                                                <span className="text">{log.path}</span>
                                            </td>
                                            <td
                                                className="table-col u-flex u-cross-center"
                                                data-title="Response"
                                            >
                                                <code className="inline-code u-un-break-text u-overflow-x-auto">
                                                    {log.response}
                                                </code>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr
                                        className="table-row u-height-auto"
                                        style={{ minBlockSize: "unset" }}
                                    >
                                        <td colSpan="5">
                                            <p className="u-color-text-offline u-padding-16">
                                                There are no logs to show
                                            </p>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </details>
                </div>
            </aside>
        </main>
    );
}

export default App
