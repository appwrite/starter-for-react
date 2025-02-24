import { useState, useRef, useEffect, useCallback } from 'react'
import './App.css'
import { client } from "./lib/appwrite";
import { AppwriteException } from "appwrite";
import AppwriteSvg from '../public/appwrite.svg'
import ReactSvg from '../public/react.svg'

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

    useEffect(() => {
        if(!detailsRef.current) return;
        detailsRef.current.addEventListener('toggle', updateHeight);

        return () => {
            if(!detailsRef.current) return;
            detailsRef.current.removeEventListener('toggle', updateHeight);}
    },[])

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
                       <img src={ReactSvg} width='72' height='72' alt='React logo'/>
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
                        <img src={AppwriteSvg} width='72' height='72' alt='Appwrite logo'/>
                    </div>
                </div>
            </div>

            <section
                className="u-flex u-flex-vertical u-main-center u-cross-center u-padding-16"
                style={{backdropFilter: "blur(1px)", height: 200}}
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
