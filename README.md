# 🍽️ TableMate: 캠퍼스 점심 소셜 매칭 플랫폼

> **"오늘 점심, 누구랑 먹지?"** > **TableMate**는 음식 취향과 식사 시간을 기반으로 캠퍼스 내 새로운 인연을 연결해주는 **소셜 매칭 / 캠퍼스 커뮤니티 서비스**입니다.

---

## 🎯 1. Project Vision

### **Service Information**
* **Service Name**: TableMate
* **Category**: 소셜 매칭 플랫폼 / 캠퍼스 커뮤니티 서비스

### **Target Users**
* **혼밥 탈출**: 캠퍼스에서 점심을 혼자 먹는 경우가 많은 대학생
* **취향 공유**: 비슷한 음식 취향을 가진 새로운 사람을 만나고 싶은 학생
* **사회적 교류**: 식사 시간에 가벼운 사회적 교류를 원하는 학생

### **Problem or Need**
대학생들은 종종 다음과 같은 상황을 경험합니다.
* 혼자 점심을 먹기 애매할 때
* 새로운 사람들과 교류하고 싶을 때
* 같은 학교 학생들과 식사 약속을 잡고 싶을 때

### **Primary Differentiation**
* **식사 기반 매칭(Meal-based Matching)**: 일반적인 SNS와 달리 '식사'라는 구체적인 목적에 집중합니다.
* **자연스러운 연결**: 사용자의 음식 취향과 시간을 중심으로 매칭하여 부담 없는 교류를 유도합니다.

---

## 🚀 2. Project Goals & Scope

### **Business Goals**
* **백엔드 시스템 개발**: 사용자, 게시글, 음식 취향 관리를 위한 안정적인 시스템 구축
* **매칭 시스템 구현**: CRUD 기반의 게시판 매칭 로직 완성
* **실시간 통신**: 서버-클라이언트 간 실시간 데이터 송수신을 위한 **WebSocket** 도입
* **프로토타입 완성**: 음식 취향 기반으로 친구를 찾을 수 있는 동작 가능한 서비스 구현

### **Major Features**
* **인증 시스템**: 회원가입 및 로그인 기능
* **프로필 설정**: 선호 음식(취향) 선택 기능
* **모집 게시글**: 점심 식사 파트너 모집 및 게시글 관리(CRUD)
* **스마트 필터링**: 음식 취향 기반의 게시글 필터링
* **참여 관리**: 댓글 및 참여 신청/수락 시스템

### **Out of Scope**
* 사용자 간 리뷰 및 평가 시스템
* 모바일 애플리케이션(App) 버전 개발

---

## 👥 3. Stakeholders & Users

### **Stakeholder Requirements**
* **개발자 (소프트웨어공학론 2팀)**: 명확한 아키텍처, 정의된 DB 구조와 API, 유지보수가 쉬운 모듈형 코드
* **교수님**: 시스템 설계 및 CRUD 기능 확인, 체계적인 프로젝트 문서화 수준
* **사용자 (대학생)**: 간단한 사용성, 취향 기반 필터링, 실시간 채팅을 통한 원활한 소통

---

## 🛠️ 4. Tech Stack

| Category | Technology |
| :--- | :--- |
| **Backend** | Java 25, Spring Boot 3.4.3, Spring Data JPA |
| **Database** | PostgreSQL |
| **Real-time** | WebSocket (STOMP) |
| **DevOps** | Docker |
| **Tools** | IntelliJ, Postman, Git |

---

## 🗺️ 5. Roadmap & Milestones

- [ ] **Milestone 1**: 프로젝트 초기 기획 (기술 스택 확정, 환경 세팅, ERD/DB 설계)
- [ ] **Milestone 2**: 회원가입 / 로그인 (인증 및 인가) 구현
- [ ] **Milestone 3**: 게시글 CRUD 기능 구현
- [ ] **Milestone 4**: 그룹별 실시간 채팅방 생성 및 연동

---

## 🔗 6. Github Address
* **Repository**: [https://github.com/niceome/software_team_2.git](https://github.com/niceome/software_team_2.git)
