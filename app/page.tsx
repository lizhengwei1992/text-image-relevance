"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import ImageAnalysisResults from "@/components/ImageAnalysisResults";
import { Button } from "@/components/ui/button";

interface AnalysisData {
  query: string;
  title: string;
  picurl?: string;
  pic_title: string;
  doc_title: string;
  pic_desc: string;
  caption_only_image: {
    details_image_caption?: string;
    abstract_image_caption?: string;
    image_type?: string;
  };
  caption_correction: {
    details_image_caption?: string;
    abstract_image_caption?: string;
    correction_instruction?: string | { 修正说明?: string };
  };
  auto_label: {
    "Query分析"?: string;
    "相关性判断理由"?: string;
    relevance?: boolean;
  };
}

export default function Home() {
  const [analysisData, setAnalysisData] = useState<AnalysisData[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const lines = text.split("\n").filter(line => line.trim());
      const parsedData = lines.map(line => JSON.parse(line));
      setAnalysisData(parsedData);
    };
    reader.readAsText(file);
  };

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">
            文图相关性自动化标注结果展示
          </h1>
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => document.getElementById("file-upload")?.click()}
              className="flex items-center gap-2 bg-primary/90 hover:bg-primary transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload JSONL File
            </Button>
            <input
              id="file-upload"
              type="file"
              accept=".jsonl"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        <div className="space-y-8">
          {analysisData.map((data, index) => (
            <ImageAnalysisResults key={index} data={data} />
          ))}
        </div>
      </div>
    </main>
  );
}
