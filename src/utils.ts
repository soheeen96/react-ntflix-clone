export function makeImagePath(id: string, format?: string) {
  return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
}

//이미지의 경로 만들어주는 함수 id : 이미지 아이디
