import { Panel, StatusPill, Table, TableCell } from "@/components/dashboard";
import { formatDashboardDate, getPublishedPageData } from "@/lib/data";

export default async function PublishedPage() {
  const posts = await getPublishedPageData();

  return (
    <Panel title="Published posts" kicker="Performance snapshots">
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
    </Panel>
  );
}
