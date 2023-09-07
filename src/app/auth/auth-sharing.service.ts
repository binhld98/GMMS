import { Subject } from "rxjs";

export class AuthSharingService {
    isLoading = new Subject<boolean>();
}