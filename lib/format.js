//editdUpdate(computeEditd(e, n), editd);

// 计算编辑距离
exports.computeEditd = function (p, t) {
  var plen = p.length + 1;
  var tlen = t.length + 1;
  var i, j;

  var matrix = new Array(plen);
  // 初始化矩阵
  for (i = 0; i < plen; i++)
    matrix[i] = new Array(tlen + 1);

  // 动态规划填充矩阵
  for (i = 0; i < plen; i++)
    for (j = 0; j < tlen; j++)
      if (i == 0)
        matrix[i][j] = j;
      else if (j == 0)
        matrix[i][j] = i;
      else
        matrix[i][j] = Math.min.apply(null, [
          matrix[i][j - 1] + 1, 
          matrix[i - 1][j] + 1, 
          (function () {
            if (p[i] == t[j])
              return matrix[i - 1][j - 1];
            else
              return matrix[i - 1][j - 1] + 1;
          })()
        ]);

  return matrix[p.length][t.length];
};

exports.editdUpdate = function (newEditd, oldEditd) {
  return newEditd > oldEditd ? oldEditd : newEditd;
};
