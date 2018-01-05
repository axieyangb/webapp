
import { Job } from './../job/job';
import { Injectable} from '@angular/core';

@Injectable()
export class OrderByPipe  {
    public transform(arr: Job[], orderFields: string) :Job[]{
        arr.sort((currentJob: Job, comparedJob: Job): number => {
            let field: string = "";
            let type: number = 0;
            let a_time: Date;
            let b_time: Date;
            let splits = orderFields.split(' ');
            if (splits.length == 0) return 0;
            field = splits[0];
            if (splits.length == 1)
                type = 1;
            else
                type = splits[1] == 'desc' ? -1 : 1;
            if (field == "id") {
                if (currentJob.Id > comparedJob.Id) return type;
                else if (currentJob.Id < comparedJob.Id) return  -type;
                return 0;
            }
            else if (field == "url") {
                if (currentJob.URL > comparedJob.URL) return type;
                else if (currentJob.URL < comparedJob.URL) return -type;
                return 0;
            }
            else if (field == "createdate") {
                
                a_time = new Date(currentJob.CreateDate);
                b_time = new Date(comparedJob.CreateDate);
                if (currentJob.CreateDate > comparedJob.CreateDate) return type;
                else if (currentJob.CreateDate < comparedJob.CreateDate) return -type;
                return 0;
            }
            else if(field="rank")
            {
                if(currentJob.Rank>comparedJob.Rank) return type;
                else if(currentJob.Rank<comparedJob.Rank) return -type;
                return 0;
            }
            else
                return 0;
        });
        return arr;
    }

/*
1: filter by visited status,
2: filter by invalid status
 */
    public filter(arr:Job[],filterType):Job[]
    {
        if(filterType==1)
        {
            
        return arr.filter(item => item.IsUserVisited==0).splice(0);
        }
        if(filterType==2)
        {
            return arr.filter(item=> item.IsReportInValid==0).splice(0);
        }
        return arr;
    }
}