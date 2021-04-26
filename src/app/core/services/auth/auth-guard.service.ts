import { Injectable } from "@angular/core";
import { CanLoad, Route, Router } from "@angular/router";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment as env } from '../../../../environments/environment';
import { DATA } from "../../data.enum";
import { StorageServiceService } from "./storage-service.service";
import { AuthService } from "./auth.service";
@Injectable()
export class AuthGuard implements CanLoad {
  constructor(private authService: AuthService, private route: Router, private storageServiceService: StorageServiceService) { }

  canLoad(route: Route) {
    if (!this.storageServiceService.getStorageItem(DATA.TOKEN)) {

      this.authService.logout();

    }
    return true;
  }
}
