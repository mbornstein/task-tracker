// import { config } from "./config";

export interface Activity {
    title: string
    comment?: string
    start: Date
    project?: string
    type?: string
    link?: string
}

// old below

// interface Project {
//   type: "project";
//   project: typeof config.dimension.projects[number];
// }

// interface Activity {
//   type: "activity";
//   activity: typeof config.dimension.activity[number];
// }

// interface Issue {
//   type: "issue";
//   issue: string;
// }

// interface PullRequest {
//   type: "pullRequest";
//   pullRequest: string;
// }

// export type Dimension = Project | Activity | Issue | PullRequest;

// type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>;

// export interface WorkItem {
//   start: string;
//   end: string;
//   comment: string;
//   dimensions: PartialRecord<Dimension["type"], Dimension>;
// }

// export interface WorkTrack {
//   workItems: WorkItem[];
// }
