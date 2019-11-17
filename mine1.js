const tbody = document.querySelector("#table tbody");
let dataset = [];
let stop_flag = false;
let open = 0;
const code = {
  opened: -1,
  screen_question: -3,
  mine_flag: -4,
  mine_question: -5,
  mine: 1,
  normal: 0
};

document.querySelector("#exec").addEventListener("click", function() {
  //내부 먼저 초기화
  tbody.textContent = "";
  document.querySelector("#result").textContent = "";
  dataset = [];
  open = 0;
  stop_flag = false;
  const hor = parseInt(document.querySelector("#hor").value);
  const ver = parseInt(document.querySelector("#ver").value);
  const mine = parseInt(document.querySelector("#mine").value);

  const candidate = Array(hor * ver)
    .fill()
    .map(function(요소, index) {
      return index;
    });

  let shuffle = [];
  while (candidate.length > hor * ver - mine) {
    const moved = candidate.splice(
      Math.floor(Math.random() * candidate.length),
      1
    )[0];
    shuffle.push(moved);
  }

  for (var i = 0; i < ver; i += 1) {
    var arr = [];
    var tr = document.createElement("tr");
    dataset.push(arr);

    for (var j = 0; j < hor; j += 1) {
      arr.push(code.normal);
      var td = document.createElement("td");

      function screen(e) {
        부모tr = e.currentTarget.parentNode;
        부모tbody = e.currentTarget.parentNode.parentNode;
        칸 = Array.prototype.indexOf.call(부모tr.children, e.currentTarget);
        줄 = Array.prototype.indexOf.call(부모tbody.children, 부모tr);
      }

      const right_click = function(e) {
        e.preventDefault();

        if (stop_flag) {
          return;
        }

        screen(e);
        if (dataset[줄][칸] === code.opened) {
          return;
        }
        if (e.currentTarget.textContent === "") {
          e.currentTarget.textContent = "!";
        } else if (e.currentTarget.textContent === "!") {
          e.currentTarget.textContent = "?";
        } else if (e.currentTarget.textContent === "?") {
          e.currentTarget.textContent = "";
        }
      };

      var left_click = function(e) {
        if (stop_flag) {
          return;
        }
        screen(e);

        if (
          e.currentTarget.textContent === "?" ||
          e.currentTarget.textContent === "!"
        ) {
          return;
        }
        e.currentTarget.classList.add("opened");
        open += 1;
        if (dataset[줄][칸] === code.mine) {
          e.currentTarget.textContent = "M";
          document.querySelector("#result").textContent = "FAILED";
          stop_flag = true;
        } else {
          var click_around = [dataset[줄][칸 - 1], dataset[줄][칸 + 1]];
          if (dataset[줄 - 1]) {
            click_around = click_around.concat(
              dataset[줄 - 1][칸 - 1],
              dataset[줄 - 1][칸],
              dataset[줄 - 1][칸 + 1]
            );
          }
          if (dataset[줄 + 1]) {
            click_around = click_around.concat(
              dataset[줄 + 1][칸 - 1],
              dataset[줄 + 1][칸],
              dataset[줄 + 1][칸 + 1]
            );
          }

          var 주변지뢰개수 = click_around.filter(function(v) {
            return [code.mine].includes(v);
          }).length;

          //조건문에서 거짓인 값 '',0,NaN,null,undefined,false
          e.currentTarget.textContent = 주변지뢰개수 || "";
          //e.currentTarget.textContent = 주변지뢰개수||'' 을 했을 경우  앞의 값이 거짓일때 뒤에 값을 쓰기위해 ||''을 추가했으나 기존 0이라고 써있던 칸이 빈칸으로 만들어지나 이때 물음표나 느낌표로 다시 클릭이 가능하기 때문에 부적절. 하나 해결했음.
          dataset[줄][칸] = code.opened;

          if (주변지뢰개수 === 0) {
            var 주변칸 = [];
            if (tbody.children[줄 - 1]) {
              주변칸 = 주변칸.concat([
                tbody.children[줄 - 1].children[칸 - 1],
                tbody.children[줄 - 1].children[칸],
                tbody.children[줄 - 1].children[칸 + 1]
              ]);
            }
            주변칸 = 주변칸.concat([
              tbody.children[줄].children[칸 - 1],
              tbody.children[줄].children[칸 + 1]
            ]);
            if (tbody.children[줄 + 1]) {
              주변칸 = 주변칸.concat([
                tbody.children[줄 + 1].children[칸 - 1],
                tbody.children[줄 + 1].children[칸],
                tbody.children[줄 + 1].children[칸 + 1]
              ]);
            }

            주변칸
              .filter(
                function(v) {
                  return !!v;
                } //배열에서 undifined나 빈배열 제거 ->이부분 이해가 잘 안됌.
              )
              .forEach(function(click_around) {
                var 부모tr = click_around.parentNode;
                var 부모tbody = click_around.parentNode.parentNode;
                var 옆칸칸 = Array.prototype.indexOf.call(
                  부모tr.children,
                  click_around
                );
                var 옆칸줄 = Array.prototype.indexOf.call(
                  부모tbody.children,
                  부모tr
                );
                if (dataset[옆칸줄][옆칸칸] !== code.opened) {
                  click_around.click();
                }
              });
          }
        }

        console.log(open, hor * ver - mine);
        if (open === hor * ver - mine) {
          stop_flag = true;
          document.querySelector("#result").textContent = "WIN";
        }
      };

      td.addEventListener("contextmenu", right_click);
      td.addEventListener("click", left_click);

      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  //지뢰심기

  for (var k = 0; k < shuffle.length; k++) {
    var vertical = Math.floor(shuffle[k] / ver);
    var horizental = shuffle[k] % ver;

    // tbody.children[vertical].children[horizental].textContent = "!";
    //화면에 보이는 mine

    dataset[vertical][horizental] = code.mine; //데이터 mine
  }
  console.log(dataset);
});
