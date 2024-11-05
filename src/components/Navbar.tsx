import React from "react";
import { Button } from "./ui/button";
import { useAuth } from "@hooks/useAuth";
import { signOutFromGoogle } from "@lib/firebase";
import { useRouter } from "next/navigation";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from "./ui/menubar";
import Image from "next/image";

/**
 * Navbar component
 */

export const Navbar: React.FC = (): React.ReactElement => {
  const router = useRouter();
  const { isGuest, user } = useAuth();

  return (
    <div className="px-4 py-4 pr-8 flex justify-between border-b-2 border-zinc">
      <div className="flex gap-2">
        <Button variant="link" onClick={() => router.push("/")}>
          App
        </Button>
        <Button variant="link" onClick={() => router.push("/page")}>
          Page
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
                <MenubarItem role="button" className="cursor-pointer bg-destructive focus:bg-red-600" automation-id="btn-sign-out" onClick={signOutFromGoogle}>
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
