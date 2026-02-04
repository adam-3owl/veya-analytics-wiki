"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MetricsTable } from "@/components/metrics-table";
import { PropertiesTable } from "@/components/properties-table";
import { Metric } from "@/types/metrics";
import { properties } from "@/types/properties";

interface ReferenceTabsProps {
  metrics: Metric[];
}

export function ReferenceTabs({ metrics }: ReferenceTabsProps) {
  return (
    <Tabs defaultValue="events">
      <TabsList>
        <TabsTrigger value="events">Events</TabsTrigger>
        <TabsTrigger value="properties">Event Properties</TabsTrigger>
      </TabsList>
      <TabsContent value="events">
        <MetricsTable metrics={metrics} />
      </TabsContent>
      <TabsContent value="properties">
        <PropertiesTable properties={properties} />
      </TabsContent>
    </Tabs>
  );
}
