// 역할 변경에 따라 입력 필드 표시 조절
document.getElementById("signupRole")?.addEventListener("change", function () {
  const role = this.value;
  document.getElementById("teacherCode").style.display = role === "teacher" ? "block" : "none";
  document.getElementById("studentFields").style.display = role === "student" ? "block" : "none";
});

// 회원가입 처리
document.getElementById("signupForm")?.addEventListener("submit", async function (e) {
  e.preventDefault(); // 기본 폼 제출 방지

  // 입력값 수집
  const id = document.getElementById("signupId").value;
  const pw = document.getElementById("signupPw").value;
  const role = document.getElementById("signupRole").value;
  const code = document.getElementById("teacherCode").value;
  const name = document.getElementById("signupName")?.value || "";
  const year = document.getElementById("signupYear")?.value || "";
  const studentId = document.getElementById("signupStudentId")?.value || "";

  // 필수 입력값 검증
  if (!id || !pw || !role) {
    alert("모든 항목을 입력해주세요.");
    return;
  }

  // 페이지 로드 시 처음에 학생/선생님 필드를 숨깁니다.
window.addEventListener("DOMContentLoaded", () => {
  const role = document.getElementById("signupRole")?.value;
  document.getElementById("teacherCode").style.display = "none";
  document.getElementById("studentFields").style.display = "none";
});

// 역할 변경에 따라 입력 필드 표시 조절
document.getElementById("signupRole")?.addEventListener("change", function () {
  const role = this.value;
  document.getElementById("teacherCode").style.display = role === "teacher" ? "block" : "none";
  document.getElementById("studentFields").style.display = role === "student" ? "block" : "none";
});


  // 선생님 인증 코드 확인 (코드가 "d"가 아니면 거절)
  if (role === "teacher" && code !== "d") {
    alert("선생님 인증 코드가 올바르지 않습니다.");
    return;
  }

  // 학생이라면 입학년도/학번 확인
  if (role === "student" && (!year || !studentId)) {
    alert("입학년도와 학번을 입력해주세요.");
    return;
  }

  // 서버에 보낼 회원 데이터 구성
  const userData = { id, pw, role, name };
  if (role === "student") {
    userData.year = year;
    userData.studentId = studentId;
  }

  try {
    // 백엔드로 POST 요청 (회원가입)
    const res = await fetch("https://hshschatbot0.onrender.com/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });

    const result = await res.json(); // 응답 JSON 파싱

    if (res.ok) {
      alert("회원가입 완료!");
      window.location.href = "login.html"; // 로그인 페이지로 이동
    } else {
      alert("회원가입 실패: " + result.message); // 서버 오류 메시지 출력
    }

  } catch (err) {
    alert("서버 연결 실패: " + err.message); // 네트워크 또는 기타 오류
  }
});


// 로그인 처리
document.getElementById("loginForm")?.addEventListener("submit", async function (e) {
  e.preventDefault(); // 기본 폼 제출 방지

  const id = document.getElementById("loginId").value;
  const pw = document.getElementById("loginPw").value;

  try {
    // 백엔드에 로그인 정보 전송
    const res = await fetch("https://hshschatbot0.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, pw })
    });

    const result = await res.json(); // 응답 JSON 파싱

    if (!res.ok) {
      alert(result.message || "로그인 실패");
      return;
    }

    const user = result.user;

    // 로그인한 사용자 정보 localStorage에 저장
    localStorage.setItem("currentUser", JSON.stringify(user));

    // 관리자일 경우 관리자 대시보드로
    if (user.id === "lucy0527") {
      window.location.href = "admin_dashboard.html";
    } 
    // 선생님이면 선생님 대시보드로
    else if (user.role === "teacher") {
      window.location.href = "dashboard.html?as=teacher";
    } 
    // 학생이면 학생 대시보드로
    else {
      window.location.href = "dashboard.html?as=student";
    }

  } catch (err) {
    alert("서버 오류: " + err.message); // 서버 또는 네트워크 오류
  }
});


  // 관리자 계정 특별 처리
  if (user.id === "lucy0527") {
    user.role = "admin";
    users[userIndex].role = "admin";
    localStorage.setItem("users", JSON.stringify(users)); // 갱신
    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "admin_dashboard.html";
  } else {
    localStorage.setItem("currentUser", JSON.stringify(user));
    if (user.role === "teacher") {
      window.location.href = "dashboard.html?as=teacher";
    } else {
      window.location.href = "dashboard.html?as=student";
    }
  }
});


fetch('https://your-backend-domain.com/api', {
  method: 'POST',
  credentials: 'include', // 쿠키를 포함하여 요청
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});

