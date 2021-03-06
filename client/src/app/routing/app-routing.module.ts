import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AdminAuthGuard } from "../guards/auth-admin/auth-admin.guard";
import { UserAuthGuard } from "../guards/auth-user/auth-user.guard";
import { LoginComponent } from "../pages/auth/login/login.component";
import { NotAuthorizedComponent } from "../pages/auth/not-authorized/not-authorized.component";
import { HomeComponent } from "../pages/home/home.component";
import { AllLineupsListComponent } from "../pages/lineups/all-lineups-list/all-lineups-list.component";
import { CurrentUserLineupsListComponent } from "../pages/lineups/current-user-lineups-list/current-user-lineups-list.component";
import { LineupEditorComponent } from "../pages/lineups/lineup-editor/lineup-editor.component";
import { LineupOverviewComponent } from "../pages/lineups/lineup-overview/lineup-overview.component";
import { PathNotFoundComponent } from "../pages/not-found/path-not-found/path-not-found.component";
import { ResourceNotFoundComponent } from "../pages/not-found/resource-not-found/resource-not-found.component";
import { PeopleListComponent } from "../pages/people/people-list/people-list.component";
import { PersonEditComponent } from "../pages/people/person-edit/person-edit.component";
import { PersonImportComponent } from "../pages/people/person-import/person-import.component";
import { PersonOverviewComponent } from "../pages/people/person-overview/person-overview.component";
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
    path: getPathForRoute(StaticPath.usersList),
    component: UsersListComponent,
    canActivate: [AdminAuthGuard],
  },
  {
    path: getPathForRoute(StaticPath.userRegistration),
    component: UserRegistrationComponent,
    canActivate: [AdminAuthGuard],
  },
  {
    path: getPathForRoute(StaticPath.currentUserOverview),
    component: UserOverviewComponent,
    canActivate: [UserAuthGuard],
  },
  {
    path: PathTemplate.userOverview,
    component: UserOverviewComponent,
    canActivate: [AdminAuthGuard],
  },
  {
    path: getPathForRoute(StaticPath.currentUserSettings),
    component: UserSettingsComponent,
    canActivate: [UserAuthGuard],
  },
  {
    path: PathTemplate.userSettings,
    component: UserSettingsComponent,
    canActivate: [AdminAuthGuard],
  },
  {
    path: getPathForRoute(StaticPath.peopleList),
    component: PeopleListComponent,
    canActivate: [UserAuthGuard],
  },
  {
    path: getPathForRoute(StaticPath.personImport),
    component: PersonImportComponent,
    canActivate: [UserAuthGuard],
  },
  {
    path: PathTemplate.personOverview,
    component: PersonOverviewComponent,
    canActivate: [UserAuthGuard],
  },
  {
    path: PathTemplate.personEdit,
    component: PersonEditComponent,
    canActivate: [UserAuthGuard],
  },
  {
    path: getPathForRoute(StaticPath.newLineup),
    component: LineupEditorComponent,
    canActivate: [UserAuthGuard],
  },
  {
    path: getPathForRoute(StaticPath.currentUserLineupsList),
    component: CurrentUserLineupsListComponent,
    canActivate: [UserAuthGuard],
  },
  {
    path: getPathForRoute(StaticPath.allLineupsList),
    component: AllLineupsListComponent,
    canActivate: [AdminAuthGuard],
  },
  {
    path: PathTemplate.lineupOverview,
    component: LineupOverviewComponent,
    canActivate: [UserAuthGuard],
  },
  {
    path: PathTemplate.lineupEdit,
    component: LineupEditorComponent,
    canActivate: [UserAuthGuard],
  },
  { path: "**", component: PathNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
