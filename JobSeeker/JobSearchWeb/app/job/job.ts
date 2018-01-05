export class Job {
    Id: number;
    JobDescription: string;
    URL: string;
    Note: string;
    Status:number;
    Rank:number;
    DetailId:number;
    InValidNum:number;
    ThumbsUpNum:number;
    HasThumbsUp:boolean=false;
    VisitedNum:number;
    CreateDate: string;
    WebsiteName:string;
    Title:string;
    SubTitle:string;
    IsUserVisited:number;
    IsUserApplied:number;
    IsReportInValid:number;
    IsFullDescriptionShow:boolean =false;
}