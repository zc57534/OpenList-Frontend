import Swal from "sweetalert2"

export function copySharePublicUrl(raw_link: string) {
  Swal.fire({
    position: "top",
    title: "Create Share URL",
    html: `
    <div style="display: flex; flex-direction: column; gap: 15px; max-width: 600px; margin: 0 auto;">
      <!-- 有效期限行 -->
      <div style="display: flex; align-items: center; gap: 10px; flex-wrap: nowrap;">
        <label for="expires" style="font-weight: bold; min-width: 80px;">ExpireOn: </label>
        <select id="expires" style="padding: 8px; border-radius: 4px; border: 1px solid #ccc; flex: 1;">
          ${Object.entries(expiresOptions)
            .map(([key, value]) => `<option value="${key}">${value}</option>`)
            .join("")}
        </select>
      </div>
      
      <!-- 自定义天数行 -->
      <div id="customDays" style="display: flex; align-items: center; gap: 10px; display: none; flex-wrap: nowrap;">
        <label for="customDaysInput" style="font-weight: bold; min-width: 80px;">ValidDay: </label>
        <input type="number" id="customDaysInput" min="1" style="padding: 8px; border-radius: 4px; border: 1px solid #ccc; flex: 1;" value="1">
      </div>
      
      <!-- 访问密码行 -->
      <div style="display: flex; align-items: center; gap: 10px; flex-wrap: nowrap;">
        <label for="password" style="font-weight: bold; min-width: 80px;">Password: </label>
        <div style="display: flex; gap: 10px;">
          <input type="text" id="password" style="padding: 8px; border-radius: 4px; border: 1px solid #ccc; width: 200px;" placeholder="No Password">
          <button id="generatePassword" style="padding: 8px 25px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Generate</button>
        </div>
      </div>
    </div>
    `,
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#007bff",
    cancelButtonColor: "#dc3545",
    customClass: {
      actions: "my-actions",
      confirmButton: "my-confirm-button",
      cancelButton: "my-cancel-button",
    },
    preConfirm: () => {
      const expires = document.getElementById("expires") as HTMLSelectElement
      const password = document.getElementById("password") as HTMLInputElement
      const customDaysInput = document.getElementById(
        "customDaysInput",
      ) as HTMLInputElement

      let expiresValue: number | string = expires.value
      if (expiresValue === "custom") {
        expiresValue = parseInt(customDaysInput.value)
        if (isNaN(expiresValue)) {
          Swal.showValidationMessage("Please enter valid days!")
          return
        }
      }

      return { expires: expiresValue, password: password.value }
    },
    didOpen: () => {
      const expires = document.getElementById("expires") as HTMLSelectElement
      const customDays = document.getElementById("customDays")

      expires.addEventListener("change", () => {
        if (expires.value === "custom") {
          customDays.style.display = "flex"
        } else {
          customDays.style.display = "none"
        }
      })
      document
        .getElementById("generatePassword")
        ?.addEventListener("click", () => {
          const password = document.getElementById(
            "password",
          ) as HTMLInputElement
          password.value = generateRandomPassword()
        })
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const { expires, password } = result.value
      // 在这里可以处理有效期和密码的逻辑，例如发送到后端 API
      // 这里仅作为示例，实际使用时请替换为你的逻辑

      // 显示第二个弹窗（分享链接）
      showResult()
    }
  })
}

async function showResult(raw_url = "") {
  await Swal.fire({
    position: "top",
    title: "Share URL Created",
    text: `Share URL：${raw_url}`,
    showConfirmButton: true,
    confirmButtonText: "Copy Link",
    confirmButtonColor: "#007bff",
    customClass: {
      confirmButton: "my-confirm-button",
    },
    didOpen: () => {
      const copyButton = Swal.getConfirmButton()
      copyButton.addEventListener("click", () => {
        navigator.clipboard.writeText(raw_url).then(() => {
          Swal.showValidationMessage("Copied!")
        })
      })
    },
  })
}

// 定义有效期限选项
const expiresOptions = {
  never: "Never",
  "1day": "1",
  "7days": "7",
  "30days": "30",
  "90days": "90",
  "365days": "365",
  custom: "Custom",
}

// 生成随机密码
const generateRandomPassword = () => {
  const chars = "ABCDEFGHJKLMNPQRSTWXYabcdefghijkmnpqrstwxy345679"
  let password = ""
  for (let i = 0; i < 4; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}
