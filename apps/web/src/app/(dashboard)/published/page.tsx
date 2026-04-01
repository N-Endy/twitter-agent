import { EmptyState, Panel, StatusPill, SummaryStrip, Table, TableCell } from "@/components/dashboard";
import { JobTriggerButton } from "@/components/job-trigger-button";
import { formatDashboardDate, getPublishedPageData } from "@/lib/data";

export default async function PublishedPage() {
  const posts = await getPublishedPageData();
  const syncedPosts = posts.filter((post) => Boolean(post.metricsSyncedAt)).length;
  const pendingSync = posts.length - syncedPosts;

  return (
    <Panel
      title="Published posts"
      kicker="Performance snapshots"
      description="This page should feel readable on a phone even when posts are long. It shows what has gone live and whether performance snapshots are current."
      actions={<JobTriggerButton job="metrics-sync" label="Sync metrics now" />}
    >
      <div className="space-y-5">
        <SummaryStrip
          items={[
            { label: "Published", value: posts.length, helper: "Posts currently visible in history.", tone: posts.length > 0 ? "good" : "warning" },
            { label: "Metrics synced", value: syncedPosts, helper: "Posts with fresh metrics snapshots.", tone: syncedPosts > 0 ? "good" : "default" },
            { label: "Pending sync", value: pendingSync, helper: "Posts still waiting for a metrics pull.", tone: pendingSync > 0 ? "warning" : "default" },
            { label: "With metrics", value: posts.filter((post) => post.metrics.length > 0).length, helper: "Posts showing at least one metrics window.", tone: "default" }
          ]}
        />

        {posts.length === 0 ? (
          <EmptyState
            title="Nothing published yet"
            body="Once scheduled drafts go live, they will appear here with their origin hook and performance metrics."
          />
        ) : (
          <Table headers={[
            { label: "Posted", className: "tech-column" },
            { label: "Text" },
            { label: "Metrics", className: "tech-column" },
            { label: "Snapshots", className: "tech-column" },
            { label: "Origin", className: "tech-column" }
          ]}>
            {posts.map((post) => (
              <tr key={post.id}>
                <TableCell label="Posted" className="tech-column text-xs font-mono">{formatDashboardDate(post.postedAt)}</TableCell>
                <TableCell label="Text">
                  <p className="text-white font-medium line-clamp-2">{post.text}</p>
                  <p className="mt-1 text-xs text-slate-500 font-mono">ID: {post.xPostId}</p>
                </TableCell>
                <TableCell label="Metrics" className="tech-column">
                  {post.metrics.length > 0 ? (
                    <div className="space-y-1">
                      {post.metrics.map((metric) => (
                        <p key={metric.id} className="text-[10px] uppercase tracking-wide text-slate-400">
                          {metric.window}: <span className="text-[var(--accent)] font-bold">{metric.likes ?? 0}L</span> • {metric.replies ?? 0}R
                        </p>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-500 uppercase tracking-widest text-[9px]">Awaiting sync</span>
                  )}
                </TableCell>
                <TableCell label="Snapshots" className="tech-column">
                  <StatusPill tone={post.metricsSyncedAt ? "good" : "warning"}>
                    {post.metricsSyncedAt ? "Synced" : "Pending"}
                  </StatusPill>
                </TableCell>
                <TableCell label="Origin" className="tech-column text-[10px] uppercase tracking-wide text-slate-500 truncate max-w-[100px]">{post.draft.idea.hook}</TableCell>
              </tr>
            ))}
          </Table>
        )}
      </div>
    </Panel>
  );
}
