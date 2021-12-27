import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AdminAuthGuard } from "../guards/auth-admin/auth-admin.guard";
import { UserAuthGuard } from "../guards/auth-user/auth-user.guard";
import { LoginComponent } from "../pages/auth/login/login.component";
import { NotAuthorizedComponent } from "../pages/auth/not-authorized/not-authorized.component";
import { HomeComponent } from "../pages/home/home.component";
import { PathNotFoundComponent } from "../pages/not-found/path-not-found/path-not-found.component";
import { ResourceNotFoundComponent } from "../pages/not-found/resource-not-found/resource-not-found.component";
import { ImportPersonComponent } from "../pages/people/import-person/import-person.component";
import { PeopleComponent } from "../pages/people/people/people.component";
import { PersonComponent } from "../pages/people/person/person.component";
import { UserOverviewComponent } from "../pages/users/user-overview/user-overview.component";
import { UserRegistrationComponent } from "../pages/users/user-registration/user-registration.component";
import { UserSettingsComponent } from "../pages/users/user-settings/user-settings.component";
import { UsersListComponent } from "../pages/users/users-list/users-list.component";
import { PathTemplate, StaticPath } from "./paths";

const getPathForRoute = (path: StaticPath) => path.substring(1);

const routes: Routes = [
  {
    path: getPathForRoute(StaticPath.root),
    redirectTo: StaticPath.home,
    pathMatch: "full",
  },
  { path: getPathForRoute(StaticPath.home), component: HomeComponent },
  {
    path: getPathForRoute(StaticPath.login),
    component: LoginComponent,
  },
  {
    path: getPathForRoute(StaticPath.notAuthorized),
    component: NotAuthorizedComponent,
  },
  {
    path: getPathForRoute(StaticPath.pathNotFound),
    component: PathNotFoundComponent,
  },
  {
    path: getPathForRoute(StaticPath.resourceNotFound),
    component: ResourceNotFoundComponent,
  },
  {
    path: getPathForRoute(StaticPath.userRegistration),
    component: UserRegistrationComponent,
    canActivate: [AdminAuthGuard],
  },
  {
    path: getPathForRoute(StaticPath.usersList),
    component: UsersListComponent,
    canActivate: [AdminAuthGuard],
  },
  {
    path: getPathForRoute(StaticPath.currentUserOverview),
    component: UserOverviewComponent,
    canActivate: [UserAuthGuard],
  },
  {
    path: getPathForRoute(StaticPath.currentUserSettings),
    component: UserSettingsComponent,
    canActivate: [UserAuthGuard],
  },
  {
    path: PathTemplate.userOverview,
    component: UserOverviewComponent,
    canActivate: [AdminAuthGuard],
  },
  {
    path: PathTemplate.userSettings,
    component: UserSettingsComponent,
    canActivate: [AdminAuthGuard],
  },
  {
    path: getPathForRoute(StaticPath.import),
    component: ImportPersonComponent,
    canActivate: [UserAuthGuard],
  },
  {
    path: getPathForRoute(StaticPath.people),
    component: PeopleComponent,
    canActivate: [UserAuthGuard],
  },
  {
    path: PathTemplate.person,
    component: PersonComponent,
    canActivate: [UserAuthGuard],
  },
  { path: "**", component: PathNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
