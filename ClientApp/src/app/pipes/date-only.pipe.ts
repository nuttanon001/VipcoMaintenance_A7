import { Pipe } from "@angular/core";
import { DatePipe } from "@angular/common";


@Pipe({
    name: "dateOnly"
})
export class DateOnlyPipe extends DatePipe {
    public transform(value: any): any {
        if (value) {
            return super.transform(value, "dd/MM/y");
        }
    }
}