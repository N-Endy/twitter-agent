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
          <Table headers={["Posted", "Text", "Metrics", "Window snapshots", "Origin"]}>
            {posts.map((post) => (
              <tr key={post.id}>
                <TableCell label="Posted">{formatDashboardDate(post.postedAt)}</TableCell>
                <TableCell label="Text">
                  <p className="text-white">{post.text}</p>
                  <p className="mt-1 text-xs text-slate-400">xPostId: {post.xPostId}</p>
                </TableCell>
                <TableCell label="Metrics">
                  {post.metrics.length > 0 ? (
                    post.metrics.map((metric) => (
                      <p key={metric.id} className="text-xs text-slate-300">
                        {metric.window}: {metric.likes ?? 0} likes, {metric.replies ?? 0} replies
                      </p>
                    ))
                  ) : (
                    <span className="text-slate-400">Awaiting sync</span>
                  )}
                </TableCell>
                <TableCell label="Window snapshots">
                  <StatusPill tone={post.metricsSyncedAt ? "good" : "warning"}>
                    {post.metricsSyncedAt ? "Synced" : "Pending"}
                  </StatusPill>
                </TableCell>
                <TableCell label="Origin">{post.draft.idea.hook}</TableCell>
              </tr>
            ))}
          </Table>
        )}
      </div>
    </Panel>
  );
}
