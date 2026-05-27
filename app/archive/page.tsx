import ArchiveContent from "../../components/ArchiveContent";
import ArchiveHeader from "../../components/ArchiveHeader";
import { fetchArchive } from "../../lib/api";

export const metadata = {
  title: "Archive — Anime Schedule",
  description: "Browse completed English dubbed anime series.",
};

export default async function ArchivePage() {
  const archiveResponse = await fetchArchive();
  const archive = archiveResponse.archive || [];

  return (
    <div className="flex flex-col items-center px-4 sm:px-6 md:px-8 py-6">
      <div className="w-full max-w-7xl">
        <ArchiveHeader totalCount={archive.length} />
        <div>
          <ArchiveContent archive={archive} />
        </div>
      </div>
    </div>
  );
}
