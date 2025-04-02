"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ImageAnalysisResultsProps {
  data: {
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
  };
}

const findImageUrl = (data: any): string => {
  const findUrlKeys = (obj: any): string[] => {
    let keys: string[] = [];
    for (const [key, value] of Object.entries(obj)) {
      if (key.toLowerCase().endsWith('url') && typeof value === 'string' && value.startsWith('http')) {
        keys.push(value);
      } else if (typeof value === 'object' && value !== null) {
        keys = keys.concat(findUrlKeys(value));
      }
    }
    return keys;
  };

  const urlKeys = findUrlKeys(data);
  return urlKeys[0] || "";
};

const getCorrectionInstruction = (instruction: string | { 修正说明?: string } | undefined): string => {
  if (!instruction) return "N/A";
  if (typeof instruction === "string") return instruction;
  if (typeof instruction === "object" && instruction.修正说明) return instruction.修正说明;
  return "N/A";
};

export default function ImageAnalysisResults({ data }: ImageAnalysisResultsProps) {
  const imageUrl = findImageUrl(data);
  const isRelevant = Boolean(data.auto_label?.relevance);

  return (
    <Card className={`p-6 border-l-4 ${isRelevant ? 'border-l-green-500' : 'border-l-red-500'}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary/90 to-primary p-3 rounded-lg text-primary-foreground">
          Query: {data.query}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-8">
        <div className="grid grid-cols-1 gap-4">
          {/* Caption Analysis Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900">
              <h3 className="text-lg font-semibold mb-3 pb-2 border-b border-blue-200 dark:border-blue-800">
                Initial Caption Analysis
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="font-medium text-sm text-blue-700 dark:text-blue-300">Details:</p>
                  <p className="text-sm mt-1 bg-white/50 dark:bg-white/5 p-2 rounded-lg">
                    {data.caption_only_image?.details_image_caption || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-sm text-blue-700 dark:text-blue-300">Abstract:</p>
                  <p className="text-sm mt-1 bg-white/50 dark:bg-white/5 p-2 rounded-lg">
                    {data.caption_only_image?.abstract_image_caption || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-sm text-blue-700 dark:text-blue-300">Type:</p>
                  <p className="text-sm mt-1 bg-white/50 dark:bg-white/5 p-2 rounded-lg">
                    {data.caption_only_image?.image_type || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50/50 dark:bg-purple-950/20 p-4 rounded-xl border border-purple-100 dark:border-purple-900">
              <h3 className="text-lg font-semibold mb-3 pb-2 border-b border-purple-200 dark:border-purple-800">
                Corrected Caption Analysis
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="font-medium text-sm text-purple-700 dark:text-purple-300">Details:</p>
                  <p className="text-sm mt-1 bg-white/50 dark:bg-white/5 p-2 rounded-lg">
                    {data.caption_correction?.details_image_caption || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-sm text-purple-700 dark:text-purple-300">Abstract:</p>
                  <p className="text-sm mt-1 bg-white/50 dark:bg-white/5 p-2 rounded-lg">
                    {data.caption_correction?.abstract_image_caption || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-sm text-purple-700 dark:text-purple-300">Correction Note:</p>
                  <p className="text-sm mt-1 bg-white/50 dark:bg-white/5 p-2 rounded-lg">
                    {getCorrectionInstruction(data.caption_correction?.correction_instruction)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Relevance Analysis Section */}
          <div className={`p-4 rounded-xl border ${
            isRelevant 
              ? 'bg-green-50/50 dark:bg-green-950/20 border-green-100 dark:border-green-900' 
              : 'bg-red-50/50 dark:bg-red-950/20 border-red-100 dark:border-red-900'
          }`}>
            <h3 className="text-lg font-semibold mb-3 pb-2 border-b border-current">
              Relevance Analysis
            </h3>
            <div className="grid gap-3">
              <div>
                <p className={`font-medium text-sm ${
                  isRelevant ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                }`}>
                  Query Analysis:
                </p>
                <p className="text-sm mt-1 bg-white/50 dark:bg-white/5 p-2 rounded-lg">
                  {data.auto_label?.["Query分析"] || "N/A"}
                </p>
              </div>
              <div>
                <p className={`font-medium text-sm ${
                  isRelevant ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                }`}>
                  Relevance Reasoning:
                </p>
                <p className="text-sm mt-1 bg-white/50 dark:bg-white/5 p-2 rounded-lg">
                  {data.auto_label?.["相关性判断理由"] || "N/A"}
                </p>
              </div>
              <div>
                <p className={`font-medium text-sm ${
                  isRelevant ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                }`}>
                  Relevance:
                </p>
                <Badge 
                  variant="outline"
                  className={`mt-1 text-sm font-medium ${
                    isRelevant 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800' 
                      : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800'
                  }`}
                >
                  {String(data.auto_label?.relevance)}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="sticky top-4 space-y-4">
            {imageUrl && (
              <>
                <div className="aspect-video relative overflow-hidden rounded-xl border shadow-lg bg-white/20 dark:bg-white/5">
                  <img
                    src={imageUrl}
                    alt="Analysis subject"
                    className="object-contain w-full h-full"
                  />
                </div>
                <div className="bg-muted/50 p-4 rounded-xl border">
                  <h4 className="font-semibold mb-3 pb-2 border-b">Extra Information</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="font-medium text-sm text-muted-foreground">Title:</p>
                      <p className="text-sm mt-1">{data.title || "N/A"}</p>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-muted-foreground">Picture Title:</p>
                      <p className="text-sm mt-1">{data.pic_title || "N/A"}</p>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-muted-foreground">Document Title:</p>
                      <p className="text-sm mt-1">{data.doc_title || "N/A"}</p>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-muted-foreground">Picture Description:</p>
                      <p className="text-sm mt-1">{data.pic_desc || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}