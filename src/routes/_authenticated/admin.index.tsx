import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowRight,
  BarChart3,
  BookOpenText,
  CalendarClock,
  Edit3,
  Eye,
  EyeOff,
  LogOut,
  Plus,
  Shield,
  Sparkles,
  Trash2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { adminDeletePost, adminListPosts } from "@/lib/blog.functions";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";


export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [
      {
        title: "Admin Dashboard",
      },
      {
        name: "robots",
        content: "noindex,nofollow",
      },
    ],
  }),

  component: AdminPage,
});


function AdminPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const listPosts = useServerFn(adminListPosts);
  const deletePost = useServerFn(adminDeletePost);


  const postsQuery = useQuery({
    queryKey: ["adminPosts"],
    queryFn: () => listPosts(),
  });


  const posts = postsQuery.data ?? [];


  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      deletePost({
        data: {
          id,
        },
      }),

    onSuccess() {
      toast.success("Post deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["adminPosts"],
      });
    },

    onError(error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Delete failed"
      );
    },
  });



  async function signOut() {
    await queryClient.cancelQueries();

    queryClient.clear();

    await supabase.auth.signOut();

    router.navigate({
      to: "/auth",
      replace: true,
    });
  }



  const total = posts.length;

  const published = posts.filter(
    (post) => post.published
  ).length;

  const drafts = total - published;


  const latest = [...posts]
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() -
        new Date(a.updated_at).getTime()
    )[0];


  return (
    <section className="relative min-h-screen overflow-hidden bg-[#050816] px-4 py-6 text-slate-100 md:px-6 md:py-8">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_36%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">


        <aside className="rounded-[1.75rem] border border-cyan-400/15 bg-slate-950/80 p-5 backdrop-blur-xl">


          <div className="flex items-center gap-3 border-b border-white/10 pb-4">

            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-200">
              <Shield className="h-5 w-5"/>
            </div>


            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">
                newsroom
              </p>

              <h1 className="text-xl font-black text-white">
                Command Center
              </h1>
            </div>

          </div>


          <div className="mt-5 space-y-3">

            <SidebarLink
              to="/admin"
              label="Dashboard"
              icon={BarChart3}
              active
            />

            <SidebarLink
              to="/admin/new"
              label="New Post"
              icon={Plus}
            />

            <SidebarLink
              to="/"
              label="Public Site"
              icon={ArrowRight}
            />

          </div>


          <div className="mt-6 space-y-3">

            <StatMini
              label="Posts"
              value={total}
            />

            <StatMini
              label="Published"
              value={published}
            />

            <StatMini
              label="Drafts"
              value={drafts}
            />

          </div>


          <button
            onClick={signOut}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold transition hover:bg-cyan-400/10"
          >

            <LogOut className="h-4 w-4"/>

            Sign out

          </button>


        </aside>

                <div className="space-y-6">


          <header className="rounded-[2rem] border border-cyan-400/15 bg-slate-950/80 p-6 backdrop-blur-xl">


            <div className="flex flex-wrap items-start justify-between gap-4">

              <div>

                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-200">

                  <Sparkles className="h-3.5 w-3.5"/>

                  AI newsroom

                </div>


                <h2 className="mt-4 text-3xl font-black text-white">
                  Blog Operations Dashboard
                </h2>


                <p className="mt-2 max-w-2xl text-sm text-slate-400">
                  Manage posts, drafts and published content from one place.
                </p>


              </div>


              <Link
                to="/admin/new"
                className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-100"
              >

                <Plus className="h-4 w-4"/>

                New Post

              </Link>


            </div>



            <div className="mt-6 grid gap-4 md:grid-cols-3">


              <DashboardCard
                label="Total Stories"
                value={total}
                icon={BookOpenText}
              />


              <DashboardCard
                label="Live Now"
                value={published}
                icon={Eye}
              />


              <DashboardCard
                label="Draft Queue"
                value={drafts}
                icon={EyeOff}
              />


            </div>


          </header>





          <div className="grid gap-6 xl:grid-cols-[1fr_320px]">


            <div className="overflow-hidden rounded-[2rem] border border-cyan-400/15 bg-slate-950/80">


              <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">

                <div>

                  <p className="text-xs uppercase tracking-wider text-cyan-200">
                    Content Stream
                  </p>


                  <p className="text-sm text-slate-400">
                    Recent posts
                  </p>

                </div>


                <CalendarClock className="h-5 w-5 text-cyan-300"/>

              </div>





              {postsQuery.isLoading && (

                <div className="p-8 text-center text-slate-400">
                  Loading posts...
                </div>

              )}





              {!postsQuery.isLoading && posts.length === 0 && (

                <div className="p-12 text-center">

                  <p className="text-lg font-semibold text-white">
                    No posts found
                  </p>

                </div>

              )}






              {posts.length > 0 && (

                <div className="overflow-x-auto">


                  <table className="w-full min-w-[800px] text-sm">


                    <thead className="bg-white/5 text-xs uppercase text-slate-400">

                      <tr>

                        <th className="px-6 py-4 text-left">
                          Title
                        </th>

                        <th className="px-6 py-4 text-left">
                          Category
                        </th>

                        <th className="px-6 py-4 text-left">
                          Status
                        </th>

                        <th className="px-6 py-4 text-left">
                          Views
                        </th>

                        <th className="px-6 py-4 text-left">
                          Updated
                        </th>

                        <th className="px-6 py-4 text-right">
                          Actions
                        </th>

                      </tr>

                    </thead>





                    <tbody>


                    {posts.map((post)=>(

                      <tr
                        key={post.id}
                        className="border-t border-white/10 hover:bg-white/5"
                      >


                        <td className="px-6 py-4">


                          <p className="font-semibold text-white">

                            {
                              post.title_en ||
                              post.title_ne ||
                              "Untitled"
                            }

                          </p>


                          <p className="text-xs text-slate-400">
                            /{post.slug}
                          </p>


                        </td>





                        <td className="px-6 py-4 text-slate-300">

                          {
                            post.category?.name_en ??
                            "Uncategorized"
                          }

                        </td>





                        <td className="px-6 py-4">

                          {
                            post.published ?

                            <Badge tone="emerald">
                              Published
                            </Badge>

                            :

                            <Badge tone="amber">
                              Draft
                            </Badge>
                          }


                        </td>





                        <td className="px-6 py-4">


                          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">

                            <Eye className="h-3 w-3 text-cyan-300"/>

                            {
                              (
                                post.views_count ??
                                0
                              ).toLocaleString()
                            }

                          </span>


                        </td>





                        <td className="px-6 py-4 text-xs text-slate-400">


                          {
                            post.updated_at
                            ?
                            formatDate(
                              post.updated_at,
                              "en",
                              "short"
                            )
                            :
                            "-"
                          }


                        </td>





                        <td className="px-6 py-4">


                          <div className="flex justify-end gap-2">


                            <Link
                              to="/admin/edit/$id"
                              params={{
                                id: post.id
                              }}
                              className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5"
                            >

                              <Edit3 className="h-4 w-4"/>

                            </Link>





                            <button
                              onClick={()=>{

                                const ok =
                                  window.confirm(
                                    "Delete this post?"
                                  );

                                if(ok){
                                  deleteMutation.mutate(
                                    post.id
                                  );
                                }

                              }}

                              className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 hover:bg-red-500/20"
                            >

                              <Trash2 className="h-4 w-4"/>

                            </button>


                          </div>


                        </td>



                      </tr>


                    ))}


                    </tbody>


                  </table>


                </div>

              )}


            </div>

                        <div className="space-y-6">


              <div className="rounded-[2rem] border border-cyan-400/15 bg-slate-950/80 p-5">


                <p className="text-xs uppercase tracking-wider text-cyan-200">
                  Latest Signal
                </p>



                {
                  latest ?

                  <div className="mt-4 space-y-3">


                    <h3 className="text-lg font-bold text-white">

                      {
                        latest.title_en ||
                        latest.title_ne ||
                        "Untitled"
                      }

                    </h3>



                    <p className="text-sm text-slate-400">

                      {
                        latest.excerpt_en ||
                        latest.excerpt_ne ||
                        "No summary available"
                      }

                    </p>



                    <div className="flex flex-wrap gap-2">


                      <Chip>

                        {
                          latest.category?.name_en ??
                          "Uncategorized"
                        }

                      </Chip>



                      <Chip>

                        {
                          latest.published
                          ?
                          "Published"
                          :
                          "Draft"
                        }

                      </Chip>



                      <Chip>

                        {
                          latest.updated_at
                          ?
                          formatDate(
                            latest.updated_at,
                            "en",
                            "short"
                          )
                          :
                          "-"
                        }

                      </Chip>


                    </div>


                  </div>


                  :

                  <p className="mt-3 text-sm text-slate-400">
                    No content available
                  </p>


                }


              </div>





              <div className="rounded-[2rem] border border-cyan-400/15 bg-slate-950/80 p-5">


                <p className="text-xs uppercase tracking-wider text-cyan-200">
                  Quick Actions
                </p>



                <div className="mt-4 grid gap-3">


                  <Link
                    to="/admin/new"
                    className="flex items-center justify-between rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-100"
                  >

                    Create Article

                    <ArrowRight className="h-4 w-4"/>

                  </Link>




                  <Link
                    to="/blog"
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200"
                  >

                    Open Blog

                    <ArrowRight className="h-4 w-4"/>

                  </Link>


                </div>


              </div>



            </div>


          </div>


        </div>


      </div>


    </section>
  );
}





function SidebarLink({
  to,
  label,
  icon: Icon,
  active,
}:{
  to:
    | "/admin"
    | "/admin/new"
    | "/";

  label:string;

  icon:LucideIcon;

  active?:boolean;

}){


  return (

    <Link

      to={to}

      className={cn(
        "flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition",

        active

        ?

        "border-cyan-400/30 bg-cyan-400/10 text-cyan-100"

        :

        "border-white/10 bg-white/5 text-slate-300 hover:bg-cyan-400/10"

      )}

    >


      <span className="flex items-center gap-3">


        <Icon className="h-4 w-4"/>

        {label}


      </span>



      <ArrowRight className="h-3.5 w-3.5"/>


    </Link>

  );

}







function DashboardCard({
  label,
  value,
  icon:Icon,

}:{
  label:string;
  value:number;
  icon:LucideIcon;

}){


  return (

    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">


      <div className="flex items-center justify-between">


        <div>


          <p className="text-xs uppercase tracking-wider text-slate-400">

            {label}

          </p>


          <p className="mt-2 text-3xl font-black text-white">

            {value}

          </p>


        </div>



        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-200">


          <Icon className="h-5 w-5"/>


        </div>


      </div>


    </div>

  );

}







function StatMini({
  label,
  value,

}:{
  label:string;
  value:number;

}){


  return (

    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">


      <p className="text-xs uppercase tracking-wider text-slate-400">

        {label}

      </p>



      <p className="mt-2 text-2xl font-black text-white">

        {value}

      </p>


    </div>

  );

}







function Badge({

 tone,

 children,

}:{

 tone:"emerald"|"amber";

 children:string;

}){


 return (

  <span

    className={cn(

      "rounded-full px-3 py-1 text-xs font-bold",

      tone==="emerald"

      ?

      "bg-emerald-400/15 text-emerald-200"

      :

      "bg-amber-400/15 text-amber-200"

    )}

  >

    {children}

  </span>

 );

}







function Chip({

 children,

}:{

 children:ReactNode;

}){


 return (

  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">

    {children}

  </span>

 );

}
