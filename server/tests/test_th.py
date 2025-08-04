import time
import pytest
import asyncio
import httpx

LOGIN_URL = "http://127.0.0.1:8000/auth/login"
PROFILE_URL = "http://127.0.0.1:8000/user/profile"

# 课程管理接口
COURSES_LIST_URL = "http://127.0.0.1:8000/teacher/course/list"
COURSE_DETAIL_URL = "http://127.0.0.1:8000/teacher/course/{}"

# 课程通知接口
COURSE_NOTIFICATIONS_URL = "http://127.0.0.1:8000/teacher/course_notification/{}/notifications"
NOTIFICATION_DETAIL_URL = "http://127.0.0.1:8000/teacher/course_notification/{}/notifications/{}"

# 课程资料接口
COURSE_MATERIALS_URL = "http://127.0.0.1:8000/teacher/course_material/{}/materials"

# 文档向量化接口
DOC_LIST_URL = "http://127.0.0.1:8000/teacher/document_vectorization/list"
DOC_SEARCH_URL = "http://127.0.0.1:8000/teacher/document_vectorization/search"
DOC_INFO_URL = "http://127.0.0.1:8000/teacher/document_vectorization/info/{}"

# 习题生成接口
EXERCISE_LIST_URL = "http://127.0.0.1:8000/teacher/exercise_generator/list"
EXERCISE_CONTENT_URL = "http://127.0.0.1:8000/teacher/exercise_generator/file_md_content/{}"

# PPT生成接口
PPT_OUTLINES_URL = "http://127.0.0.1:8000/teacher/ppt/outlines"
PPT_LIST_URL = "http://127.0.0.1:8000/teacher/ppt/list_ppt"

TEACHER_USER = {"user_id": "T2025001", "password": "mmmm123"}
CONCURRENCY = 500

async def get_teacher_token():
    async with httpx.AsyncClient() as client:
        resp = await client.post(LOGIN_URL, json=TEACHER_USER)
        return resp.json()["access_token"]

async def fetch_profile(token):
    headers = {"Authorization": f"Bearer {token}"}
    async with httpx.AsyncClient() as client:
        resp = await client.get(PROFILE_URL, headers=headers)
        return resp.status_code

async def fetch_courses_list(token):
    headers = {"Authorization": f"Bearer {token}"}
    async with httpx.AsyncClient() as client:
        resp = await client.get(COURSES_LIST_URL, headers=headers)
        return resp.status_code, resp.json() if resp.status_code == 200 else None

async def fetch_course_detail(token, course_id):
    headers = {"Authorization": f"Bearer {token}"}
    url = COURSE_DETAIL_URL.format(course_id)
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, headers=headers)
        return resp.status_code

async def fetch_course_notifications(token, course_id):
    headers = {"Authorization": f"Bearer {token}"}
    url = COURSE_NOTIFICATIONS_URL.format(course_id)
    params = {"page": 1, "page_size": 20}
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, headers=headers, params=params)
        return resp.status_code, resp.json() if resp.status_code == 200 else None

async def fetch_notification_detail(token, course_id, notification_id):
    headers = {"Authorization": f"Bearer {token}"}
    url = NOTIFICATION_DETAIL_URL.format(course_id, notification_id)
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, headers=headers)
        return resp.status_code

async def fetch_course_materials(token, course_id):
    headers = {"Authorization": f"Bearer {token}"}
    url = COURSE_MATERIALS_URL.format(course_id)
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, headers=headers)
        return resp.status_code

async def fetch_doc_list(token):
    headers = {"Authorization": f"Bearer {token}"}
    async with httpx.AsyncClient() as client:
        resp = await client.get(DOC_LIST_URL, headers=headers)
        return resp.status_code, resp.json() if resp.status_code == 200 else None

async def fetch_doc_search(token):
    headers = {"Authorization": f"Bearer {token}"}
    params = {"keyword": "test", "limit": 20}
    async with httpx.AsyncClient() as client:
        resp = await client.get(DOC_SEARCH_URL, headers=headers, params=params)
        return resp.status_code

async def fetch_doc_info(token, document_id):
    headers = {"Authorization": f"Bearer {token}"}
    url = DOC_INFO_URL.format(document_id)
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, headers=headers)
        return resp.status_code

async def fetch_exercise_list(token):
    headers = {"Authorization": f"Bearer {token}"}
    params = {"limit": 50}
    async with httpx.AsyncClient() as client:
        resp = await client.get(EXERCISE_LIST_URL, headers=headers, params=params)
        return resp.status_code, resp.json() if resp.status_code == 200 else None

async def fetch_exercise_content(token, filename):
    headers = {"Authorization": f"Bearer {token}"}
    url = EXERCISE_CONTENT_URL.format(filename)
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, headers=headers)
        return resp.status_code

async def fetch_ppt_outlines(token):
    headers = {"Authorization": f"Bearer {token}"}
    async with httpx.AsyncClient() as client:
        resp = await client.get(PPT_OUTLINES_URL, headers=headers)
        return resp.status_code

async def fetch_ppt_list(token):
    headers = {"Authorization": f"Bearer {token}"}
    async with httpx.AsyncClient() as client:
        resp = await client.get(PPT_LIST_URL, headers=headers)
        return resp.status_code

@pytest.mark.asyncio
async def test_teacher_concurrent_profile_requests():
    token = await get_teacher_token()
    start = time.time()
    tasks = [fetch_profile(token) for _ in range(CONCURRENCY)]
    results = await asyncio.gather(*tasks)
    end = time.time()
    print(f"教师用户信息接口 - 总耗时: {end - start:.2f}s")
    print(f"教师用户信息接口 - 成功数: {results.count(200)} / {CONCURRENCY}")
    assert results.count(200) == CONCURRENCY

@pytest.mark.asyncio
async def test_teacher_concurrent_course_management():
    token = await get_teacher_token()

    # 获取课程列表
    status, data = await fetch_courses_list(token)
    course_id = None
    if status == 200 and data:
        courses = data
        if courses:
            course_id = courses[0].get("id")

    start = time.time()

    # 并发测试课程列表
    tasks_list = [fetch_courses_list(token) for _ in range(CONCURRENCY)]
    results_list = await asyncio.gather(*tasks_list)

    # 如果有课程ID，测试课程详情和资料
    if course_id:
        tasks_detail = [fetch_course_detail(token, course_id) for _ in range(CONCURRENCY)]
        tasks_materials = [fetch_course_materials(token, course_id) for _ in range(CONCURRENCY)]

        results_detail = await asyncio.gather(*tasks_detail)
        results_materials = await asyncio.gather(*tasks_materials)

        print(f"课程详情接口 - 成功数: {results_detail.count(200)} / {CONCURRENCY}")
        print(f"课程资料接口 - 成功数: {results_materials.count(200)} / {CONCURRENCY}")

    end = time.time()
    print(f"课程管理相关接口 - 总耗时: {end - start:.2f}s")
    print(f"课程列表接口 - 成功数: {[r[0] for r in results_list].count(200)} / {CONCURRENCY}")

    assert all(r[0] == 200 for r in results_list)

@pytest.mark.asyncio
async def test_teacher_concurrent_notification_queries():
    token = await get_teacher_token()

    # 获取课程列表以获取course_id
    status, data = await fetch_courses_list(token)
    course_id = None
    notification_id = None

    if status == 200 and data:
        courses = data
        if courses:
            course_id = courses[0].get("id")
            # 获取通知列表
            notif_status, notif_data = await fetch_course_notifications(token, course_id)
            if notif_status == 200 and notif_data and notif_data.get("notifications"):
                notifications = notif_data.get("notifications", [])
                if notifications:
                    notification_id = notifications[0].get("id")

    start = time.time()

    # 如果有课程ID，测试通知列表
    if course_id:
        tasks_notifications = [fetch_course_notifications(token, course_id) for _ in range(CONCURRENCY)]
        results_notifications = await asyncio.gather(*tasks_notifications)
        print(f"课程通知列表接口 - 成功数: {[r[0] for r in results_notifications].count(200)} / {CONCURRENCY}")

        # 如果有通知ID，测试通知详情
        if notification_id:
            tasks_detail = [fetch_notification_detail(token, course_id, notification_id) for _ in range(CONCURRENCY)]
            results_detail = await asyncio.gather(*tasks_detail)
            print(f"通知详情接口 - 成功数: {results_detail.count(200)} / {CONCURRENCY}")

    end = time.time()
    print(f"课程通知相关接口 - 总耗时: {end - start:.2f}s")

@pytest.mark.asyncio
async def test_teacher_concurrent_document_queries():
    token = await get_teacher_token()

    # 获取文档列表
    status, data = await fetch_doc_list(token)
    document_id = None
    if status == 200 and data and data.get("documents"):
        documents = data.get("documents", [])
        if documents:
            document_id = documents[0].get("id") or documents[0].get("document_id")

    start = time.time()

    # 并发测试文档列表
    tasks_list = [fetch_doc_list(token) for _ in range(CONCURRENCY)]
    # 并发测试文档搜索
    tasks_search = [fetch_doc_search(token) for _ in range(CONCURRENCY)]

    results_list = await asyncio.gather(*tasks_list)
    results_search = await asyncio.gather(*tasks_search)

    # 如果有文档ID，测试文档详情
    if document_id:
        tasks_info = [fetch_doc_info(token, document_id) for _ in range(CONCURRENCY)]
        results_info = await asyncio.gather(*tasks_info)
        print(f"文档详情接口 - 成功数: {results_info.count(200)} / {CONCURRENCY}")

    end = time.time()
    print(f"文档向量化相关接口 - 总耗时: {end - start:.2f}s")
    print(f"文档列表接口 - 成功数: {[r[0] for r in results_list].count(200)} / {CONCURRENCY}")
    print(f"文档搜索接口 - 成功数: {results_search.count(200)} / {CONCURRENCY}")

    assert all(r[0] == 200 for r in results_list)
    assert results_search.count(200) == CONCURRENCY

@pytest.mark.asyncio
async def test_teacher_concurrent_exercise_queries():
    token = await get_teacher_token()

    # 获取习题列表
    status, data = await fetch_exercise_list(token)
    filename = None
    if status == 200 and data and data.get("exercises"):
        exercises = data.get("exercises", [])
        if exercises:
            filename = exercises[0].get("md_filename") or exercises[0].get("filename")

    start = time.time()

    # 并发测试习题列表
    tasks_list = [fetch_exercise_list(token) for _ in range(CONCURRENCY)]
    results_list = await asyncio.gather(*tasks_list)

    # 如果有文件名，测试习题内容
    if filename:
        tasks_content = [fetch_exercise_content(token, filename) for _ in range(CONCURRENCY)]
        results_content = await asyncio.gather(*tasks_content)
        print(f"习题内容接口 - 成功数: {results_content.count(200)} / {CONCURRENCY}")

    end = time.time()
    print(f"习题生成相关接口 - 总耗时: {end - start:.2f}s")
    print(f"习题列表接口 - 成功数: {[r[0] for r in results_list].count(200)} / {CONCURRENCY}")

    assert all(r[0] == 200 for r in results_list)

@pytest.mark.asyncio
async def test_teacher_concurrent_ppt_queries():
    token = await get_teacher_token()
    start = time.time()

    # 并发测试PPT大纲列表
    tasks_outlines = [fetch_ppt_outlines(token) for _ in range(CONCURRENCY)]
    # 并发测试PPT文件列表
    tasks_ppt = [fetch_ppt_list(token) for _ in range(CONCURRENCY)]

    results_outlines = await asyncio.gather(*tasks_outlines)
    results_ppt = await asyncio.gather(*tasks_ppt)

    end = time.time()
    print(f"PPT生成相关接口 - 总耗时: {end - start:.2f}s")
    print(f"PPT大纲列表接口 - 成功数: {results_outlines.count(200)} / {CONCURRENCY}")
    print(f"PPT文件列表接口 - 成功数: {results_ppt.count(200)} / {CONCURRENCY}")

    assert results_outlines.count(200) == CONCURRENCY
    assert results_ppt.count(200) == CONCURRENCY

@pytest.mark.asyncio
async def test_teacher_all_concurrent_queries():
    """综合测试所有教师查询接口"""
    token = await get_teacher_token()
    start = time.time()

    # 创建所有查询任务
    all_tasks = []

    # 用户信息
    all_tasks.extend([fetch_profile(token) for _ in range(3)])

    # 课程列表
    all_tasks.extend([fetch_courses_list(token) for _ in range(3)])

    # 文档列表和搜索
    all_tasks.extend([fetch_doc_list(token) for _ in range(3)])
    all_tasks.extend([fetch_doc_search(token) for _ in range(3)])

    # 习题列表
    all_tasks.extend([fetch_exercise_list(token) for _ in range(3)])

    # PPT大纲和文件列表
    all_tasks.extend([fetch_ppt_outlines(token) for _ in range(3)])
    all_tasks.extend([fetch_ppt_list(token) for _ in range(3)])

    results = await asyncio.gather(*all_tasks)
    end = time.time()

    print(f"教师所有查询接口综合测试 - 总耗时: {end - start:.2f}s")
    print(f"教师所有查询接口综合测试 - 总请求数: {len(all_tasks)}")

    # 统计成功的请求
    success_count = 0
    for result in results:
        if isinstance(result, int) and result == 200:
            success_count += 1
        elif isinstance(result, tuple) and result[0] == 200:
            success_count += 1

    print(f"教师所有查询接口综合测试 - 成功数: {success_count} / {len(all_tasks)}")
    assert success_count == len(all_tasks)