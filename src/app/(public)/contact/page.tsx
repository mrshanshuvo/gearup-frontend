import React from "react";
import { Metadata } from "next";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  HelpCircle,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Contact Us & Support | GearUp",
  description:
    "Get in touch with GearUp customer support or reach our team directly.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-3 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
          <HelpCircle className="h-4 w-4" /> 24/7 Renter & Provider Support
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          We&apos;re Here to Help
        </h1>
        <p className="mx-auto max-w-xl text-sm text-slate-500 dark:text-slate-400">
          Have questions about equipment rentals, hosting your gear, or payment
          billing? Reach out to our dedicated support team anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Contact Info Cards */}
        <div className="space-y-4 lg:col-span-5">
          <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-bold">
                <Mail className="h-4 w-4 text-rose-600" /> Email Us
              </CardTitle>
              <CardDescription className="text-xs">
                Our support team responds within 2 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href="mailto:support@gearup.app"
                className="text-sm font-semibold text-rose-600 hover:underline dark:text-rose-400"
              >
                support@gearup.app
              </a>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-bold">
                <Phone className="h-4 w-4 text-rose-600" /> Toll-Free Phone
              </CardTitle>
              <CardDescription className="text-xs">
                Monday – Sunday, 8:00 AM – 8:00 PM EST.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href="tel:18005554327"
                className="text-sm font-semibold text-slate-900 hover:underline dark:text-white"
              >
                +1 (800) 555-GEAR
              </a>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-bold">
                <MapPin className="h-4 w-4 text-rose-600" /> Headquarters
              </CardTitle>
              <CardDescription className="text-xs">
                GearUp Rental Operations Inc.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-slate-600 dark:text-slate-400">
              548 Market Street, Suite 900
              <br />
              San Francisco, CA 94104
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="border-slate-200 bg-white shadow-md lg:col-span-7 dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <MessageSquare className="h-5 w-5 text-rose-600" /> Send Us a
              Message
            </CardTitle>
            <CardDescription className="text-xs">
              Fill out the form below and we will get back to you shortly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1 text-left">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Name
                </label>
                <Input placeholder="Your full name" />
              </div>
              <div className="space-y-1 text-left">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <Input type="email" placeholder="you@example.com" />
              </div>
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Subject
              </label>
              <Input placeholder="Rental inquiry, listing help, etc." />
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Message
              </label>
              <textarea
                rows={4}
                placeholder="How can we help you today?"
                className="w-full rounded-md border border-slate-200 bg-transparent p-3 text-xs shadow-xs outline-none focus:ring-2 focus:ring-rose-500 dark:border-slate-800 dark:bg-slate-950"
              />
            </div>

            <Button className="w-full cursor-pointer bg-rose-600 font-bold text-white hover:bg-rose-700">
              Send Message <Send className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
