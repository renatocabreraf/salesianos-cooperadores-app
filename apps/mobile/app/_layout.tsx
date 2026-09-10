import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SQLiteProvider } from "expo-sqlite";
import { getDatabase } from "../src/database";

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="salesianos_cooperadores.db" onInit={getDatabase}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#1e40af" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="pva/[slug]"
          options={{ title: "PVA" }}
        />
        <Stack.Screen
          name="bible/[bookId]"
          options={{ title: "Libro" }}
        />
        <Stack.Screen
          name="bible/[bookId]/[chapterId]"
          options={{ title: "Capítulo" }}
        />
        <Stack.Screen
          name="library/[categorySlug]"
          options={{ title: "Documentos" }}
        />
        <Stack.Screen
          name="library/[categorySlug]/[docSlug]"
          options={{ title: "Documento" }}
        />
        <Stack.Screen
          name="favorites"
          options={{ title: "Favoritos" }}
        />
        <Stack.Screen
          name="offline"
          options={{ title: "Descargas Offline" }}
        />
      </Stack>
    </SQLiteProvider>
  );
}
