import { NextFunction, Request, Response } from "express";
import { stringify } from "csv-stringify";

export const exportCsvFile =
  (props: { fileName?: string; csvData: Record<string, string | number>[] }) =>
  async (req: Request, res: Response) => {
    const defaultFileName = "download-" + Date.now();
    const { fileName = defaultFileName, csvData } = props;
    // adding appropriate headers, so browsers can start downloading
    // file as soon as this request starts to get served
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${fileName}.csv`
    );
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Pragma", "no-cache");
    stringify(csvData, { header: true }).pipe(res);
    //   return res.status(200).json(jsonReponse);
  };
