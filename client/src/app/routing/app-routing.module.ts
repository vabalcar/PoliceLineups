import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { UserAuthGuard } from "./guards/auth-user/auth-user.guard";
import { AdminAuthGuard } from "./guards/auth-admin/auth-admin.guard";

import { LoginComponent } from "../components/pages/login/login.component";
import { NotFoundComponent } from "../components/pages/not-found/not-found.component";
import { PeopleComponent } from "../components/pages/people/people.component";
import { PersonComponent } from "../components/pages/person/person.component";
import { HomeComponent } from "../components/pages/home/home.component";
import { RegisterComponent } from "../components/pages/register/register.component";
import { ImportPersonComponent } from "../components/pages/import-person/import-person.component";
import { UserSettingsComponent } from "../components/pages/user-settings/user-settings.component";
import { UsersListComponent } from "../components/pages/users-list/users-list.component";
import { NotAuthorizedComponent } from "../components/pages/not-authorized/not-authorized.component";

const routes: Routes = [
  {
    path: "register",
    component: RegisterComponent,
    canActivate: [AdminAuthGuard],
  },
  {
    path: "users",
    component: UsersListComponent,
    canActivate: [AdminAuthGuard],
  },
  {
    path: "user/:username/settings",
    component: UserSettingsComponent,
    canActivate: [AdminAuthGuard],
  },
  {
    path: "currentUser/settings",
    component: UserSettingsComponent,
    canActivate: [UserAuthGuard],
  },
  {
    path: "import",
    component: ImportPersonComponent,
    canActivate: [UserAuthGuard],
  },
  { path: "people", component: PeopleComponent, canActivate: [UserAuthGuard] },
  {
    path: "person/:id",
    component: PersonComponent,
    canActivate: [UserAuthGuard],
  },
  {
    path: "login",
    component: LoginComponent,
    children: [{ path: "**", component: LoginComponent }],
  },
  { path: "home", component: HomeComponent },
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "not-authorized", component: NotAuthorizedComponent },
  { path: "**", component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
