"use client";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Brain,
  Upload,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { useUserStore } from "@/lib/useUserStore";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
}


export default function CreateClone() {
  const router = useRouter();
  const [cloneName, setCloneName] = useState("");
  const [selectedTones, setSelectedTones] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [catchphrases, setCatchphrases] = useState("");
  const [dos, setDos] = useState("");
  const [donts, setDonts] = useState("");
  const [freeformDescription, setFreeformDescription] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  // const [linksDialogOpen, setLinksDialogOpen] = useState(false);
  // const [youtubeLinksDialogOpen, setYoutubeLinksDialogOpen] = useState(false);
  const [links] = useState<string[]>([""]);
  const [youtubeLinks] = useState<string[]>([""]);
  const [cloneImage, setCloneImage] = useState<File>(null!);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const { userId, setUser, name, email } = useUserStore();
  const [linkedin, setLinkedin] = useState("");
  const [company, setCompany] = useState("");
  const [jobrole, setJobrole] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const uniqueDomains = ["AI/ML", "Data & Analytics", "Software", "Consulting", "Finance", "Marketing", "DevOps", "VC", "Higher Studies", "Core industries", "Product Designer(UI/UX)", "Product Manager", "Founder"];

  const toneOptions = [
    "Friendly",
    "Professional",
    "Visionary",
    "Humble",
    "Motivational",
    "Empathetic",
    "Witty",
    "Authoritative",
    "Caring",
    "Inspiring",
  ];

  const styleOptions = [
    "Storytelling",
    "Technical explanation",
    "Direct and concise",
    "Conversational",
    "Philosophical",
    "Analytical",
    "Casual",
    "Educational",
  ];

  const valueOptions = [
    "Discipline",
    "Innovation",
    "Empathy",
    "Rationality",
    "Peace",
    "Unity",
    "Simplicity",
    "Growth",
    "Authenticity",
    "Excellence",
  ];

  const handleToneChange = (tone: string, checked: boolean) => {
    if (checked) {
      setSelectedTones([...selectedTones, tone]);
    } else {
      setSelectedTones(selectedTones.filter((t) => t !== tone));
    }
  };

  const handleStyleChange = (style: string, checked: boolean) => {
    if (checked) {
      setSelectedStyles([...selectedStyles, style]);
    } else {
      setSelectedStyles(selectedStyles.filter((s) => s !== style));
    }
  };

  const handleValueChange = (value: string, checked: boolean) => {
    if (checked) {
      setSelectedValues([...selectedValues, value]);
    } else {
      setSelectedValues(selectedValues.filter((v) => v !== value));
    }
  };

  // const handleAddLink = () => {
  //   setLinks([...links, ""]);
  // };

  // const handleLinkChange = (index: number, value: string) => {
  //   const newLinks = [...links];
  //   newLinks[index] = value;
  //   setLinks(newLinks);
  // };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCloneImage(file);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "clone-images");
      formData.append("type", "image");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData, // no Content-Type header needed — browser sets it automatically
      });

      const data = await res.json();
      setImageUrl(data.url);
    } catch (err) {
      console.error("❌ Image upload failed:", err);
    }
  };


  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type.split("/")[1].toUpperCase(),
      file: file,
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 1024 * 1024 * 1024,
  });

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // const handleRemoveLink = (index: number) => {
  //   setLinks(links.filter((_, i) => i !== index));
  // };

  // const handleAddYoutubeLink = () => {
  //   setYoutubeLinks([...youtubeLinks, ""]);
  // };

  // const handleYoutubeLinkChange = (index: number, value: string) => {
  //   const newYoutubeLinks = [...youtubeLinks];
  //   newYoutubeLinks[index] = value;
  //   setYoutubeLinks(newYoutubeLinks);
  // };

  // const handleRemoveYoutubeLink = (index: number) => {
  //   setYoutubeLinks(youtubeLinks.filter((_, i) => i !== index));
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if ((!cloneImage) || !(cloneName || name) || (!selectedDomain) || (!company) || (!jobrole) || (!linkedin)) {
      toast.error("Please fill all required fields before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("userEmail", email);
    formData.append("clone_name", cloneName ? cloneName : name);
    formData.append("clone_intro", `${jobrole} at ${company}`);
    formData.append("domain", selectedDomain ? selectedDomain : "");
    formData.append("tone", JSON.stringify(selectedTones));
    formData.append("style", JSON.stringify(selectedStyles));
    formData.append("values", JSON.stringify(selectedValues));
    formData.append("catchphrases", JSON.stringify(catchphrases));
    formData.append("dos", dos);
    formData.append("donts", donts);
    formData.append("freeform_description", freeformDescription);
    formData.append(
      "youtubeLinkUpload",
      JSON.stringify(youtubeLinks.filter((link) => link.trim() !== ""))
    );
    formData.append(
      "otherLinkUpload",
      JSON.stringify(links.filter((link) => link.trim() !== ""))
    );
    formData.append("image", imageUrl);
    uploadedFiles.forEach((file) => {
      formData.append("fileUploads", file.file);
    });

    // update user profile via FormData (separate request)
    try {
      const userForm = new FormData();
      userForm.append("linkedin", linkedin || "");
      userForm.append("company", company || "");
      userForm.append("jobrole", jobrole || "");

      const userUpdateRes = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        body: userForm, // FormData - do not set Content-Type header
      });

      if (userUpdateRes.ok) {
        toast.success("Profile updated successfully");
      } else {
        let errMsg = `Failed to update profile: ${userUpdateRes.status}`;
        try {
          const errJson = await userUpdateRes.json();
          errMsg = errJson.message || errMsg;
        } catch {
          // ignore JSON parse errors
        }
        toast.error(errMsg);
      }
    } catch (err) {
      console.error("Failed to update user profile request:", err);
      toast.error("Failed to update profile. Please try again.");
    }


    await toast.promise(
      (async () => {
        const response = await fetch(`/api/clones`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          let errorMsg = `Submission failed:${response.status}`;

          try {
            const errorJson = await response.json();
            errorMsg = errorJson.message || errorMsg;
          } catch {
            const errorText = await response.text();
            errorMsg = errorText || errorMsg;
          }

          throw new Error(errorMsg);
        }

        const data = await response.json();

        if (data.data) {
          setUser({ cloneId: data.data.clone_id });
        }

        setTimeout(() => router.push("/explore"), 1000);
        return `${data.message}`;
      })(),
      {
        loading: "Generating clone...",
        success: (msg) => msg,
        error: (err) => err.message || "Something went wrong",
      }
    );
  };


  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-serif font-bold">Clone Profile</h1>
          </div>
          <p className="text-muted-foreground">
            Configure your digital clone&apos;s personality and behavior
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Clone Name and Image */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif">
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <Label
                        htmlFor="cloneName"
                        className="text-base font-semibold"
                      >
                        Clone Name<span className="text-red-500 -ml-2">*</span>
                      </Label>
                      <Input
                        id="cloneName"
                        value={cloneName || name || ""}
                        onChange={(e) => setCloneName(e.target.value)}
                        placeholder="Enter your clone's name"
                        className="mt-2"
                      />

                    </div>
                  </div>

                </div>
                <div className="flex flex-col items-center">
                  <Label className="text-base font-semibold mb-2">
                    Clone Image<span className="text-red-500 -ml-2">*</span>
                  </Label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="clone-image-upload"
                    />
                    {imageUrl ? (
                      <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-muted-foreground/30">
                        <Image
                          src={imageUrl}
                          alt="Clone Image"
                          width={128}
                          height={128}
                          className="object-cover w-32 h-32"
                        />
                      </div>
                    ) : (
                      <label
                        htmlFor="clone-image-upload"
                        className="w-32 h-32 rounded-full bg-muted border-2 border-dashed border-muted-foreground/30 flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
                      >

                        <div className="text-center">
                          <Upload className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Upload Image
                          </span>
                        </div>

                      </label>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tone and Style */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif"></CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>LinkedIn<span className="text-red-500 -ml-2">*</span></Label>
                  <Input
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Working Company<span className="text-red-500 -ml-2">*</span></Label>
                  <Input
                    type="string"
                    placeholder="Company Name"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Role<span className="text-red-500 -ml-2">*</span></Label>
                  <Input
                    placeholder="Role at Company"
                    value={jobrole}
                    onChange={(e) => setJobrole(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Domain<span className="text-red-500 -ml-2">*</span></Label>
                  <Select onValueChange={(val) => setSelectedDomain(val)} value={selectedDomain ?? ""}>
                    <SelectTrigger className="w-[280px]">
                      <SelectValue placeholder="Select a domain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
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
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif"></CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-[1fr_auto_1fr] gap-8">
                <div>
                  <Label className="text-base font-semibold mb-4 block">
                    Tone
                  </Label>
                  <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2">
                    {toneOptions.map((tone) => (
                      <div key={tone} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tone-${tone}`}
                          checked={selectedTones.includes(tone)}
                          onCheckedChange={(checked) =>
                            handleToneChange(tone, checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={`tone-${tone}`}
                          className="text-sm cursor-pointer"
                        >
                          {tone}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator orientation="vertical" />
                <div>
                  <Label className="text-base font-semibold mb-4 block">
                    Style
                  </Label>
                  <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2">
                    {styleOptions.map((style) => (
                      <div key={style} className="flex items-center space-x-2">
                        <Checkbox
                          id={`style-${style}`}
                          checked={selectedStyles.includes(style)}
                          onCheckedChange={(checked) =>
                            handleStyleChange(style, checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={`style-${style}`}
                          className="text-sm cursor-pointer"
                        >
                          {style}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Catchphrases */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif">Catchphrases</CardTitle>
              <CardDescription>
                Enter up to 5 signature phrases that the clone should use
                (optional)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={catchphrases}
                onChange={(e) => setCatchphrases(e.target.value)}
                placeholder="Enter signature phrases, separated by commas or new lines"
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>

          {/* Core Values */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif">Core Values</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 max-h-64 overflow-y-auto">
                {valueOptions.map((value) => (
                  <div key={value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`value-${value}`}
                      checked={selectedValues.includes(value)}
                      onCheckedChange={(checked) =>
                        handleValueChange(value, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`value-${value}`}
                      className="text-sm cursor-pointer"
                    >
                      {value}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Do's and Don'ts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif">Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="dos" className="text-base font-semibold">
                    Do&apos;s
                  </Label>
                  <Textarea
                    id="dos"
                    value={dos}
                    onChange={(e) => setDos(e.target.value)}
                    placeholder="Things the clone should always do while answering"
                    className="mt-2 min-h-[120px]"
                  />
                </div>
                <div>
                  <Label htmlFor="donts" className="text-base font-semibold">
                    Don&apos;ts
                  </Label>
                  <Textarea
                    id="donts"
                    value={donts}
                    onChange={(e) => setDonts(e.target.value)}
                    placeholder="Things the clone should avoid while answering"
                    className="mt-2 min-h-[120px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Freeform Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif">
                Freeform Description
              </CardTitle>
              <CardDescription>
                Describe in your own words how the clone should behave, think
                and guide others
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={freeformDescription}
                onChange={(e) => setFreeformDescription(e.target.value)}
                placeholder="Describe your clone's personality, approach, and unique characteristics in detail..."
                className="min-h-[150px]"
              />
            </CardContent>
          </Card>

          {/* Content Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif">
                Share Your Content
              </CardTitle>
              <CardDescription>
                Choose files to share your content.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-1">
                <Dialog
                  open={uploadDialogOpen}
                  onOpenChange={setUploadDialogOpen}
                >
                  <DialogTrigger asChild>
                    <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors">
                      <Upload className="h-12 w-fit mx-auto mb-4 text-muted-foreground" />
                      <h3 className="font-semibold text-lg mb-2">
                        Upload Files
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Share files directly from your device
                      </p>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Upload Files</DialogTitle>
                      <DialogDescription>
                        Upload your user-downloadable files.
                      </DialogDescription>
                    </DialogHeader>

                    {/* Dropzone Area */}
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? "border-primary bg-primary/10" : ""
                        }`}
                    >
                      <input {...getInputProps()} />
                      <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        {isDragActive ? (
                          "Drop the files here..."
                        ) : (
                          <>
                            Drop your files here or{" "}
                            <span className="text-primary underline">
                              browse
                            </span>
                          </>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Max file size up to 1 GB
                      </p>
                    </div>

                    {/* Uploaded Files List */}
                    {uploadedFiles.length > 0 && (
                      <div className="space-y-3 mt-4">
                        <h4 className="font-medium text-sm">Uploaded Files:</h4>
                        {uploadedFiles.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between bg-muted p-3 rounded-md border"
                          >
                            <div className="flex items-center gap-3">
                              <div className="bg-primary/10 text-xs text-primary px-2 py-1 rounded">
                                {file.type}
                              </div>
                              <div>
                                <p className="text-sm font-medium">
                                  {file.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatFileSize(file.size)}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFile(file.id)}
                              className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        variant="outline"
                        onClick={() => setUploadDialogOpen(false)}
                      >
                        Back
                      </Button>
                      <Button onClick={() => setUploadDialogOpen(false)}>
                        Done
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* <Dialog
                  open={youtubeLinksDialogOpen}
                  onOpenChange={setYoutubeLinksDialogOpen}
                >
                  <DialogTrigger asChild>
                    <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors">
                      <Play className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="font-semibold text-lg mb-2">
                        YouTube Links
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Share YouTube videos
                      </p>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add YouTube Links</DialogTitle>
                      <DialogDescription>
                        Add YouTube video URLs you want to share
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      {youtubeLinks.map((link, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={link}
                            onChange={(e) =>
                              handleYoutubeLinkChange(index, e.target.value)
                            }
                            placeholder="Enter YouTube URL"
                          />
                          {youtubeLinks.length > 1 && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleRemoveYoutubeLink(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        onClick={handleAddYoutubeLink}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Another YouTube Link
                      </Button>
                    </div>
                    <Button
                      onClick={() => setYoutubeLinksDialogOpen(false)}
                      className="w-full bg-red-600 hover:bg-red-700"
                    >
                      Done
                    </Button>
                  </DialogContent>
                </Dialog>

                <Dialog
                  open={linksDialogOpen}
                  onOpenChange={setLinksDialogOpen}
                >
                  <DialogTrigger asChild>
                    <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors">
                      <LinkIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="font-semibold text-lg mb-2">
                        Other Links
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Share other content via URLs
                      </p>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add Other Links</DialogTitle>
                      <DialogDescription>
                        Add other links you want to share (articles, documents,
                        etc.)
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      {links.map((link, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={link}
                            onChange={(e) =>
                              handleLinkChange(index, e.target.value)
                            }
                            placeholder="Enter link URL"
                          />
                          {links.length > 1 && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleRemoveLink(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        onClick={handleAddLink}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Another Link
                      </Button>
                    </div>
                    <Button
                      onClick={() => setLinksDialogOpen(false)}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Done
                    </Button>
                  </DialogContent>
                </Dialog> */}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button
              type="submit"
              size="lg"
              className="bg-primary hover:bg-[#3c3b3b] text-primary-foreground font-semibold px-12 py-3"
            >
              Create Your Clone
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

}
