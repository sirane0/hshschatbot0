// 페이지 로드 시 학생/선생님 필드를 숨깁니다.
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("teacherCode").style.display = "none";
  document.getElementById("studentFields").style.display = "none";
});

// 역할 변경에 따라 입력 필드 표시 조절
const roleSelect = document.getElementById("signupRole");
roleSelect?.addEventListener("change", function () {
  const role = this.value;
  document.getElementById("teacherCode").style.display = role === "teacher" ? "block" : "none";
  document.getElementById("studentFields").style.display = role === "student" ? "block" : "none";
});

// [1] 회원가입 폼 요소 선택
const signupForm = document.getElementById("signupForm");

// [2] 회원가입 폼 제출 이벤트 등록
signupForm?.addEventListener("submit", async function(e) {
  e.preventDefault(); // 기본 폼 제출 새로고침 방지

  // [3] 입력값 가져오기
  const id = document.getElementById("signupId").value.trim();
  const pw = document.getElementById("signupPw").value.trim();
  const role = document.getElementById("signupRole").value;
  const teacherCode = document.getElementById("teacherCode").value.trim();
  const name = document.getElementById("signupName").value.trim();
  const year = document.getElementById("signupYear").value.trim();
  const studentId = document.getElementById("signupStudentId").value.trim();

  // [4] 필수값 확인
  if (!id || !pw || !role) {
    alert("아이디, 비밀번호, 역할은 필수 입력입니다.");
    return;
  }
  
  // [5] 선생님 인증 코드 검사
  if (role === "teacher" && teacherCode !== "d") {
    alert("선생님 인증 코드가 올바르지 않습니다.");
    return;
  }

  // [6] 학생일 경우 추가 필드 검사
  if (role === "student" && (!year || !studentId)) {
    alert("입학년도와 학번을 입력해주세요.");
    return;
  }

  // [7] 서버에 보낼 사용자 객체 생성
  const userData = {
    id,
    password: pw,
    role,
    name,
  };
  if (role === "student") {
    userData.year = year;
    userData.studentId = studentId;
  }

  try {
    // [8] 백엔드 회원가입 API 호출
    const response = await fetch("https://hshs-chatbot-backend.onrender.com/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
      credentials: "include"
    });

    const result = await response.json();

    // [9] 서버 응답 처리
    if (response.ok) {
      alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
      window.location.href = "login.html";
    } else {
      alert("회원가입 실패: " + (result.message || "알 수 없는 오류"));
    }
  } catch (error) {
    // [10] 네트워크 에러 처리
    alert("서버 연결 실패: " + error.message);
  }
});

// ------------------------------------------

// [11] 로그인 폼 요소 선택
const loginForm = document.getElementById("loginForm");

// [12] 로그인 폼 제출 이벤트 등록
loginForm?.addEventListener("submit", async function(e) {
  e.preventDefault();

  const id = document.getElementById("loginId").value.trim();
  const pw = document.getElementById("loginPw").value.trim();

  if (!id || !pw) {
    alert("아이디와 비밀번호를 입력하세요.");
    return;
  }

  try {
    // [13] 백엔드 로그인 API 호출
    const response = await fetch("https://hshs-chatbot-backend.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password: pw }),
      credentials: "include"
    });

    const result = await response.json();

    // [14] 로그인 실패 처리
    if (!response.ok) {
      alert(result.message || "로그인 실패");
      return;
    }

    // [15] 로그인 성공 시 로컬스토리지에 저장 및 페이지 이동
    const user = result.user;
    localStorage.setItem("currentUser", JSON.stringify(user));

    if (user.id === "lucy0527" || user.role === "admin") {
      window.location.href = "admin_dashboard.html";
    } else if (user.role === "teacher") {
      window.location.href = "dashboard.html?as=teacher";
    } else {
      window.location.href = "dashboard.html?as=student";
    }
  } catch (error) {
    alert("서버 오류: " + error.message);
  }
});