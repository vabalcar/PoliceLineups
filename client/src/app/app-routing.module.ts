import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { UserAuthGuard } from "./auth-user.guard";
import { AdminAuthGuard } from "./auth-admin.guard";

import { LoginComponent } from "./login/login.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { PeopleComponent } from "./people/people.component";
import { PersonComponent } from "./person/person.component";
import { HomeComponent } from "./home/home.component";
import { RegisterComponent } from "./register/register.component";
import { ImportPersonComponent } from "./import-person/import-person.component";
import { UserSettingsComponent } from "./user-settings/user-settings.component";

const routes: Routes = [
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
    path: "register",
    component: RegisterComponent,
    canActivate: [AdminAuthGuard],
  },
  {
    path: "currentUser/settings",
    component: UserSettingsComponent,
    canActivate: [UserAuthGuard],
  },
  {
    path: "login",
    component: LoginComponent,
    children: [{ path: "**", component: LoginComponent }],
  },
  { path: "home", component: HomeComponent },
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "**", component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
