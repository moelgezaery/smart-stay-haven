
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { Sun, Moon, Monitor, Globe, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const GeneralSettings = () => {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
  };

  const handleLanguageChange = (newLanguage: "en" | "ar") => {
    setLanguage(newLanguage);
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-navy-500">{t("generalSettings")}</h1>
        <p className="text-muted-foreground mt-1">{t("settingsDescription")}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Theme Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t("theme")}</CardTitle>
            <CardDescription>{t("themeDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={theme === "light" ? "default" : "outline"} 
                size="sm"
                onClick={() => handleThemeChange("light")}
                className="gap-2"
              >
                <Sun className="h-4 w-4" />
                {t("lightMode")}
              </Button>
              <Button 
                variant={theme === "dark" ? "default" : "outline"} 
                size="sm"
                onClick={() => handleThemeChange("dark")}
                className="gap-2"
              >
                <Moon className="h-4 w-4" />
                {t("darkMode")}
              </Button>
              <Button 
                variant={theme === "system" ? "default" : "outline"} 
                size="sm"
                onClick={() => handleThemeChange("system")}
                className="gap-2"
              >
                <Monitor className="h-4 w-4" />
                {t("systemTheme")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Language Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t("language")}</CardTitle>
            <CardDescription>{t("languageDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={language === "en" ? "default" : "outline"} 
                size="sm"
                onClick={() => handleLanguageChange("en")}
                className="gap-2"
              >
                <Globe className="h-4 w-4" />
                {t("english")}
              </Button>
              <Button 
                variant={language === "ar" ? "default" : "outline"} 
                size="sm"
                onClick={() => handleLanguageChange("ar")}
                className="gap-2"
              >
                <Languages className="h-4 w-4" />
                {t("arabic")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default GeneralSettings;
