import { api } from "./api"

export const authService = {
  login: async (email: string, password: string) => {
    const res = await api.post("api/accounts/login/", {
      email,
      password,
    })

    return res.data // { token }
  },
  signUp: async (email: string, password: string, first_name: string, last_name:string) => {
    const res = await api.post("api/accounts/signup/", {
      email,
      password,
      first_name,
      last_name
    })

    return res.data // { token }
  },
    forgotPassword: async (email: string) => {
    const res = await api.post("api/accounts/password/reset/", {
      email
    })

    return res.data // { token }
  },
    resetPassword: async (code: string, password: string) => {
    const res = await api.post("api/accounts/password/reset/verified/", {
      code,
      password
    })

    return res.data // { token }
  },
    humanizer: async (text: string, mode: string) => {
    const res = await api.post("api/humanizer/humanize/", {
      text,
      mode,
    })

    return res.data // { token }
  },
      assignmentGen: async (form) => {
    const res = await api.post("api/assignment/generate/", form)

    return res.data // { token }
  },
        mcqAttempt: async (id, payload) => {
    const res = await api.post(`api/history/${id}/attempt/`, payload)

    return res.data // { token }
  },
  getMe: async () => {
    const res = await api.get("api/accounts/profile/")
    return res.data
  },
    dashboardOverview: async () => {
    const res = await api.get("api/accounts/dashboard/overview/")
    return res.data
  },
    humanizerHistory: async () => {
    const res = await api.get("api/humanizer/history/")
    return res.data
  },
      assignmentHistory: async () => {
    const res = await api.get("api/assignment/history/")
    return res.data
  },
        singleAssignmentHistory: async (id) => {
    const res = await api.get(`api/assignment/history/${id}/`)
    return res.data
  },
singleAssignmentDelete: async (id) => {
  const res = await api.delete(`api/assignment/history/${id}/delete/`);
  return res.data;
},
deleteAllMcq: async () => {
  const res = await api.delete('api/history/delete-all/mcq/');
  return res.data;
},
singleMcqDelete: async (id) => {
  const res = await api.delete(`api/history/${id}/delete/mcq/`);
  return res.data;
},
singleHHumanizerDelete: async (id) => {
  const res = await api.delete(`api/humanizer/history/${id}/`);
  return res.data;
},
    summarizerHistory: async () => {
    const res = await api.get("api/summarizer/history/")
    return res.data
  },
      mcqHistory: async () => {
    const res = await api.get("api/history/mcq/")
    return res.data
  },
    singleSummarizerHistory: async (id) => {
    const res = await api.get(`api/summarizer/history/${id}/`)
    return res.data
  },
      singleHistoryMcq: async (id) => {
    const res = await api.get(`api/history/${id}/mcq/`)
    return res.data
  },
exportAssignment: async (id, format: "pdf" | "docx") => {
  const res = await api.get(
    `api/assignment/history/${id}/export/${format}/`,
    {
      responseType: "blob",
    }
  );

  return res.data;
},
summarizerExport: async (id, format: "pdf" | "docx") => {
  const res = await api.get(
    `api/summarizer/history/${id}/export/${format}/`,
    {
      responseType: "blob",
    }
  );

  return res.data;
},
singleSummazrizerDelete: async (id) => {
  const res = await api.delete(`api/summarizer/history/${id}/delete/`);
  return res.data;
},
exportHistory: async (id, format: "pdf" | "docx") => {
  const res = await api.get(
    `api/humanizer/${id}/export/${format}/`,
    {
      responseType: "blob",
    }
  );

  return res.data;
},
      summarizerGen: async (contentData) => {
    const res = await api.post("api/summarizer/summarize/", contentData)
    console.log("SENDING DATA:", contentData);
    return res.data // { token }
  },
        mcqGen: async (contentData) => {
    const res = await api.post("api/generate-mcq/", contentData)
    console.log("SENDING DATA:", contentData);
    return res.data // { token }
  },
  allSummazrizerDelete: async () => {
  const res = await api.delete(`api/summarizer/history/clear/`);
  return res.data;
},
  logout: async () => {
    const res = await api.get("api/accounts/logout/")
    return res.data
  },
    stripeHistory: async () => {
    const res = await api.get("api/stripe/history/")
    return res.data
  },
   stripeBilling: async (payload) => {
    const res = await api.post("api/stripe/create-checkout/", payload)

    return res.data
  },
}
