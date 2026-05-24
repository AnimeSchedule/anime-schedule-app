import ArchiveContent from "../../components/ArchiveContent";
import ArchiveHeader from "../../components/ArchiveHeader";
import { fetchArchive } from "../../lib/api";

export default async function ArchivePage() {
  const archiveResponse = await fetchArchive();
  const archive = archiveResponse.archive || [];

  return (
    <div className="flex flex-col items-center px-4 sm:px-6 md:px-8 py-6">
      <div className="w-full max-w-7xl">
        <ArchiveHeader />
        <div>
          <ArchiveContent archive={archive} />
        </div>
      </div>
    </div>
  );
}
