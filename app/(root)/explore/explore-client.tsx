"use client";
import useSWR from "swr";
import { useUserStore } from "@/lib/useUserStore"
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Clone {
  _id: string;
  clone_id: string;
  clone_name: string;
  clone_intro: string;
  image?: string;
  freeform_description: string;
  domain: string;
  values: string[];
  status: string;
}
interface CloneApiResponse {
  success: boolean;
  data: Clone[];
}

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ExploreClient() {
  const fetcher = (url: string): Promise<CloneApiResponse> =>
    fetch(url).then((res) => res.json());
  const { data, error, isLoading } = useSWR<CloneApiResponse>("/api/clones", fetcher);
  const { cloneId } = useUserStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  const filteredClones = data?.data?.filter((clone: Clone) =>
    clone.status?.toLowerCase() === "live" &&
  clone.clone_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
  (selectedDomain ? (clone.domain!.trim() === selectedDomain) : true)
) ?? [];

const uniqueDomains = useMemo(() => {
  const domains = (filteredClones ?? []).map((c) => c.domain!.trim());
  return Array.from(new Set(domains));
}, [data]);


  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load</p>;

  return (
    <>
      <div className="text-center mb-12">
        {/* keep search bar width (max-w-2xl) but place select to its right in the same row */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="max-w-2xl w-full">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by name, expertise, or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg rounded-full border-2 focus:border-primary w-full"
              />
            </div>
          </div>

          <div className="flex-shrink-0">
            <Select onValueChange={(val) => setSelectedDomain(val === "__all__" ? null : val)} value={selectedDomain ?? "__all__"}>
              <SelectTrigger className="w-[280px] rounded-full border-2 focus:border-primary">
                <SelectValue placeholder="Select a domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="__all__">All domains</SelectItem>
                  {uniqueDomains.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClones.slice().reverse().map((clone: Clone) => (
          <Card
            key={clone.clone_id}
            className="relative overflow-hidden group transition-all duration-300 transform hover:-translate-y-1 shadow-md border-0 h-[300px]"
          >
            {/* Background image */}
            <div className="absolute inset-0">
              <Image
                src={clone.image ?? "/newPic.jpg"}
                alt={clone.clone_name}
                className="w-full h-full object-cover object-[center_20px]"
                width={100}
                height={100}
              />
              <div className="absolute bottom-0 left-0 w-full h-1/5 opacity-50" />
            </div>

            {/* Overlay content */}
            <div className="absolute bottom-0 left-0 z-10 w-full overflow-hidden group">
              {/* Glass backdrop container */}
              <div className="bg-gradient-to-t from-black/80 via-black/40 to-transparent backdrop-blur-md transition-all duration-500 ease-in-out h-[70px] group-hover:h-[120px] p-4 flex flex-col justify-end text-white">

                {/* Top row — clone name + chat button */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <CardTitle className="text-lg font-serif truncate min-w-0 text-left">
                      {clone.clone_name}
                    </CardTitle>
                  </div>
                  <Link href={`/chat/${clone.clone_id}`}>
                    <Button
                      size="sm"
                      className="bg-white text-black hover:bg-gray-100 flex-shrink-0"
                    >
                      Chat Now
                    </Button>
                  </Link>
                </div>

                {/* Clone intro (hidden until hover) */}
                <p className="text-base text-left opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-500 ease-in-out line-clamp-3">
                  {clone.clone_intro}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* CTA Section */}
      {!cloneId && (
        <div className="mt-16 text-center bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8">
          <h2 className="text-2xl font-serif font-bold mb-4">
            Want to create your own clone?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join hundreds of experts who are scaling their impact and helping
            thousands of people worldwide.
          </p>
          <Link href="/create-clone">
            <Button
              size="lg"
              className="bg-primary hover:bg-[#3c3b3b] text-primary-foreground font-semibold px-8"
            >
              Create Your Clone
            </Button>
          </Link>
        </div>
      )}
    </>
  );
}


