import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import useFirebase from "@hooks/useFirebase";
import { Button } from "./ui/button";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from "./ui/menubar";

/**
 * Navbar component
 */

export const Navbar: React.FC = (): React.ReactElement => {
  const router = useRouter();
  const { isGuest, user, signOutUser } = useFirebase();
  const pathname = usePathname();

  return (
    <div className="px-4 py-4 pr-8 flex justify-between border-b-2 border-zinc">
      <div className="flex gap-2">
        <Button variant={pathname === "/" ? "default" : "link"} onClick={() => router.push("/")}>
          App
        </Button>
        <Button variant={pathname === "/page" ? "default" : "link"} onClick={() => router.push("/page")}>
          Page
        </Button>
        <Button variant={pathname === "/search" ? "default" : "link"} onClick={() => router.push("/search")}>
          Search
        </Button>
      </div>
      <div>
        {(!isGuest && user) && (
          <Menubar className="px-0 py-0 border-0">
            <MenubarMenu>
              <MenubarTrigger aria-label="account menu button" className="px-0 py-0 rounded-full overflow-hidden cursor-pointer" automation-id="btn-user-menu">
                <Image src={user.photoURL || "/placeholders/user.jpg"} width={36} height={36} alt="" />
              </MenubarTrigger>
              <MenubarContent side="bottom" align="end">
                <MenubarItem disabled>
                  {user.displayName || user.email}
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem role="button" className="cursor-pointer bg-destructive focus:bg-red-600" automation-id="btn-sign-out" onClick={signOutUser}>
                  Sign Out
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        )}
      </div>
    </div>
  );
};
