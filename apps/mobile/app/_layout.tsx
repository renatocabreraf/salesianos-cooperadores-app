import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#1e40af" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="pva/index" options={{ title: "PVA" }} />
        <Stack.Screen name="pva/[slug]" options={{ title: "PVA" }} />
        <Stack.Screen name="directorios" options={{ title: "Directorios" }} />
        <Stack.Screen name="bibliografia" options={{ title: "Bibliografía" }} />
        <Stack.Screen name="aguinaldos" options={{ title: "Aguinaldos" }} />
        <Stack.Screen name="bible/index" options={{ title: "Biblia" }} />
        <Stack.Screen name="bible/[bookId]" options={{ title: "Libro" }} />
        <Stack.Screen name="bible/[bookId]/[chapterId]" options={{ title: "Capítulo" }} />
        <Stack.Screen name="library/[categorySlug]" options={{ title: "Documentos" }} />
        <Stack.Screen name="library/[categorySlug]/[docSlug]" options={{ title: "Documento" }} />
        <Stack.Screen name="pdf" options={{ title: "PDF" }} />
        <Stack.Screen name="favorites" options={{ title: "Favoritos" }} />
        <Stack.Screen name="offline" options={{ title: "Descargas Offline" }} />
      </Stack>
    </>
  );
}
