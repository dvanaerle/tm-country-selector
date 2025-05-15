import type { Metadata } from "next";
import Header from "@/components/header";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Pages.NotFound.Metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function NotFound() {
  const t = useTranslations("Pages.NotFound");

  return (
    <>
      <Header />
      <div className="container mx-auto flex min-h-[calc(100dvh-(--spacing(19)))] max-w-(--breakpoint-md) flex-col items-center px-4 py-12 sm:px-6 xl:p-20">
        <section className="w-full rounded-lg bg-white p-4 sm:p-10">
          <h1>Meetinstructies Gumax® glazen schuifwand</h1>
          <Tabs defaultValue="account" className="w-[400px]">
            <TabsList>
              <TabsTrigger value="account">Hoogte muurprofiel</TabsTrigger>
              <TabsTrigger value="password">Hoogte onderkant goot</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="depth">Diepte veranda</Label>
                <Select id="depth">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Link
                href="/"
                className={buttonVariants({
                  variant: "default",
                })}
              >
                Bereken doorloophoogte
              </Link>
            </TabsContent>
            <TabsContent value="password">
              Change your password here.
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </>
  );
}
