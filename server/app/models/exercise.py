from enum import IntEnum


class ExerciseType(IntEnum):
    """习题类型枚举"""
    CHOICE = 1  # 选择题
    FILL_BLANK = 2  # 填空题
    SHORT_ANSWER = 3  # 简答题
