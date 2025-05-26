import request from '../../utils/request'

const MGR_PROBLEM = '/mgr/problem'

// 创建题目
export function createProblem(data: {
    title: string
    description: string
    example_stdio?: [string, string, string][]
    stdio?: [string, string, string][]
}) {
    return request.post(`${MGR_PROBLEM}/create`, data)
}

// 修改题目
export function updateProblem(data: {
    problemId: string
    title: string
    description: string
    example_stdio?: [string, string, string][]
    stdio?: [string, string, string][]
}) {
    return request.put(`${MGR_PROBLEM}`, data)
}

//获取题目
export interface ProblemData {
    title: string;
    description: string;
    example_stdio?: [string, string, string][];
    stdio?: [string, string, string][];
}

interface ApiResponse<T> {
    code: number;
    msg: string | null;
    data: T | null;
}

export function getProblem(problemId: string) {
    return request.get<ApiResponse<ProblemData>>(`${MGR_PROBLEM}/${problemId}`);
}

// 删除题目
export function deleteProblem(problemId: string) {
    return request.delete(`${MGR_PROBLEM}/${problemId}`)
}
