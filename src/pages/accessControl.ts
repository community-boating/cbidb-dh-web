import asc from "app/AppStateContainer";
import { PERMISSIONS } from "models/permissions";
import assertNever from "util/assertNever";
import { PageName } from "./pageNames";

export function canAccessPage(pageName: PageName): boolean {
	switch (pageName) {
		case PageName.HOME:
		case PageName.JP_CLASSES:
		case PageName.STAGGERED_ORDER:
		case PageName.DOCK_REPORT:
		case PageName.USERS:
		case PageName.USERS_EDIT:
		case PageName.USERS_NEW:
		case PageName.MANAGE_INSTRUCTORS:
		case PageName.MANAGE_TAGS:
		case PageName.MANAGE_CLASS_LOCATIONS:
		case PageName.MANAGE_HIGH_SCHOOLS:
		case PageName.MANAGE_DONATION_FUNDS:
		case PageName.SIGNOUTS_TABLES:
			return true; // !!asc.state.login.permissions[Permissions.PERM_GENERAL_ADMIN]
		case PageName.MANAGE_PERMISSIONS:
			return !!asc.state.login.permissions[PERMISSIONS.PERM_GENERAL_ADMIN]
		default:
			//assertNever(pageName);
			return false;
	}
}
