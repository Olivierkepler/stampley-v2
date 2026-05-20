// import { auth } from "@/lib/auth";
// import { redirect } from "next/navigation";
// import PreSurveyClient from "./pre-survey-client";

// export default async function Page() {
//   const session = await auth();

//   if (!session?.user?.id) {
//     redirect("/login");
//   }

//   return <PreSurveyClient />;
// }