import { Subject } from 'rxjs/Subject';


export class ListenerService {

  clickEvent = new Subject<Event>();
  isLoggedIn = new Subject<boolean>();
  inputFormSubmited = new Subject<any>();


}
