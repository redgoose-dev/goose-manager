/**
 * printf
 *
 * @param {String} str
 * @param {String} values
 * @return {String}
 */
export function printf(str, ...values)
{
	for (let i = 0; i < values.length; i++)
	{
		let pattern = `\\{${i}\\}`;
		let replace = new RegExp(pattern, 'g');
		str = str.replace(replace, values[i]);
	}
	return str;
}


export const service = {
	noItem: 'No item',
};

export const error = {
	service: 'Service error',
	id: 'Please enter only alphanumeric characters `-` and `_`.',
	noValue: `There is no value for '{0}'.`,
	confirmPassword: `확인용 비밀번호가 다릅니다.`,
	failedLogin: 'Failed login',
	noItem: 'No item',
};

export const msg = {
	successChangePassword: 'Success change user password.',
	failedChangePassword: 'Failed change user password.',
	questionChangePassword: '비밀번호가 변경되었으므로 로그아웃이 필요합니다. 로그아웃 하시겠습니까?',
	notLogin: 'You are not logged in.',
	failedParsingJson: 'Failed parsing json data.',
	confirmUsingDraft: '이 내용으로 사용하시겠습니까?',
	confirmRemove: '내용을 정말 삭제할까요?',
	inputDraftDescription: '임시 저장할 글에대한 메모를 입력하세요.',
};