// ===== 페이지 로드시 역할 관련 필드 숨기기 =====
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("teacherCode")?.style.setProperty("display", "none");
  document.getElementById("studentFields")?.style.setProperty("display", "none");
});

// ===== 역할 선택 시 필드 표시 조정 =====
const roleSelect = document.getElementById("signupRole");
roleSelect?.addEventListener("change", function () {
  const role = this.value;
  document.getElementById("teacherCode")?.style.setProperty("display", role === "teacher" ? "block" : "none");
  document.getElementById("studentFields")?.style.setProperty("display", role === "student" ? "block" : "none");
});

// ===== 회원가입 처리 =====
const signupForm = document.getElementById("signupForm");
signupForm?.addEventListener("submit", async function (e) {
  e.preventDefault();

  const id = document.getElementById("signupId")?.value.trim();
  const pw = document.getElementById("signupPw")?.value.trim();
  const role = document.getElementById("signupRole")?.value;
  const code = document.getElementById("teacherCode")?.value.trim();
  const name = document.getElementById("signupName")?.value.trim() || "";
  const year = document.getElementById("signupYear")?.value.trim() || "";
  const studentId = document.getElementById("signupStudentId")?.value.trim() || "";

  if (!id || !pw || !role) {
    alert("모든 항목을 입력해주세요.");
    return;
  }

  if (role === "teacher" && code !== "d") {
    alert("선생님 인증 코드가 올바르지 않습니다.");
    return;
  }

  if (role === "student" && (!year || !studentId)) {
    alert("입학년도와 학번을 입력해주세요.");
    return;
  }

  const userData = {
    id,
    password: pw,
    role,
    name,
    ...(role === "student" && { year, studentId })
  };

  try {
    const res = await fetch("https://hshschatbot0.onrender.com/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });

    const result = await res.json();

    if (res.ok) {
      alert("회원가입 완료!");
      window.location.href = "login.html";
    } else {
      alert("회원가입 실패: " + result.message);
    }
  } catch (err) {
    alert("서버 연결 실패: " + err.message);
  }
});

// ===== 로그인 처리 =====
const loginForm = document.getElementById("loginForm");
loginForm?.addEventListener("submit", async function (e) {
  e.preventDefault();

  const id = document.getElementById("loginId")?.value.trim();
  const pw = document.getElementById("loginPw")?.value.trim();

  try {
    const res = await fetch("https://hshschatbot0.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password: pw })
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.message || "로그인 실패");
      return;
    }

    const user = result.user;
    localStorage.setItem("currentUser", JSON.stringify(user));

    // 역할별 분기
    if (user.id === "lucy0527") {
      window.location.href = "admin_dashboard.html";
    } else if (user.role === "teacher") {
      window.location.href = "dashboard.html?as=teacher";
    } else {
      window.location.href = "dashboard.html?as=student";
    }

  } catch (err) {
    alert("서버 오류: " + err.message);
  }
});
