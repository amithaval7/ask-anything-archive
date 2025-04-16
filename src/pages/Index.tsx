import { ArchiveLayout } from "@/components/layout/ArchiveLayout";
import { ContentViewer } from "@/components/content/ContentViewer";

const Index = () => {
  return (
    <ArchiveLayout>
      <div className="max-w-5xl mx-auto">
        <ContentViewer type="pdf" title="Sample Document.pdf" />
      </div>
    </ArchiveLayout>
  );
};

export default Index;
