      $((e) => {
        const $stat_form = $('#stat-form');
        const table_lines = [];
        table_lines[5+2-1] = null;

        const xs = [];

        table_lines[0] = [
          '            <table>',
          '              <thead>',
          '                <tr>',
          '                  <th>',
String.raw`                    \({i}\)`,
          '                  </th>',
          '                  <th>',
String.raw`                    \(x_{i}\)`,
          '                  </th>',
          '                  <th>',
String.raw`                    \(\left(x_{i} - \bar{x}\right)\)`,
          '                  </th>',
          '                  <th>',
String.raw`                    \(\left(x_{i} - \bar{x}\right)^{2}\)`,
          '                  </th>',
          '                  <th>',
String.raw`                    \(z_{i} = \dfrac{x_{i} - \bar{x}}{S}\)`,
          '                  </th>',
          '                </tr>',
          '              </thead>',
          '              <tbody>'
        ];

        for (var k = 0, n = 5; (k < n); ++k) {
          table_lines[k+1] = [
            '                <tr>',
            `                  <th>${k+1}</th>`,
            `                  <td><input class='x-data' name='x-data' value='${(0==k) ? 1 : 0}' tabindex='1'/></td>`,
            '                  <td/>',
            '                  <td/>',
            '                  <td/>',
            '                </tr>'
          ];
        }

        table_lines[5+2-1] = [
          '              </tbody>',
          "              <tfoot class='totals'>",
          '                <tr>',
          '                  <td/>',
          "                  <td id='mean-sum'></td>",
          "                  <td id='dev-sum'></td>",
          "                  <td id='sqrdev-sum'></td>",
          '                </tr>',
          '              </tfoot>',
          '            </table>',
          "            <p id='calc-cardinality'></p>",
          "            <p id='calc-mean'></p>",
          "            <p id='calc-variance'></p>",
          "            <p id='calc-standard-deviaton'></p>"
        ];

        $stat_form.html(table_lines.flat().join('\n'));
        $stat_form.attr('action', 'javascript:void(0);');

        $form_data_x = $stat_form.find('.x-data');
        const len = $form_data_x.length;

        xs[len-1] = 0;
        $stat_form.each((k,e,a) => {
          $(e).on('change', calculate);
        });
        calculate(e);

        function calculate(e) {
          $form_data_x = $stat_form.find('.x-data');

          const n = $form_data_x.length;
          const xs = [];
          xs[n-1] = 0;

          $('#calc-cardinality').html(String.raw`\(n = \operatorname{\nu}\left(\mathcal{X}\right) = ${n}\)`);

          var mean_sum = 0;
          var dev_sum = 0;
          var sqrdev_sum = 0;

          for (var k = 0; (k < n); ++k) {
            const $el = $($form_data_x.get(k));
            const val = Number($el.val());
            if (Number.isNaN(val)) {
              $el.addClass('alert-danger');
              return;
            }
            $el.removeClass('alert-danger');
            xs[k] = val;

            mean_sum += xs[k];
          }

          const mean = (mean_sum)/n;

          $('#mean-sum').html(String.raw`\(${mean_sum}\)`);

          $('#calc-mean').html([
  String.raw`                \(\bar{x}`,
  String.raw`                = \left.\dfrac{{\sum\limits_{i=1}^{n}}{x_{i}}}{n}\right.`,
  String.raw`                = \dfrac{${mean_sum}}{${n}}`,
  String.raw`                = ${mean}\)`,
          ].join('\n'));

          const devs = []
          const sqrdevs = []
          devs[n-1] = 0;
          sqrdevs[n-1] = 0;

          for (var k = 0; (k < n); ++k) {
            devs[k] = (xs[k] - mean);
            sqrdevs[k] = (devs[k]*devs[k]);
            dev_sum += devs[k];
            sqrdev_sum += sqrdevs[k];
            $form_data_x.eq(k).parent().next().html(String.raw`\(\left(${xs[k]} - ${mean}\right) = ${devs[k]}\)`);
            $form_data_x.eq(k).parent().next().next().html(String.raw`\(\left(${devs[k]}\right)^2 = ${sqrdevs[k]}\)`);
          }

          const variance = (sqrdev_sum / (n-1));
          const standard_deviation = Math.sqrt(variance);

          $('#dev-sum').html(String.raw`\(${dev_sum}\)`);
          $('#sqrdev-sum').html(String.raw`\(${sqrdev_sum}\)`);

          $('#calc-variance').html([
  String.raw`                \(S^{2}`,
  String.raw`                = \left.\dfrac{{\sum\limits_{i=1}^{n}}{\left(x_{i} - \bar{x}\right)^2}}{n-1}\right.`,
  String.raw`                = \dfrac{${sqrdev_sum}}{${n-1}}`,
  String.raw`                = ${variance}\)`,
          ].join('\n'));

          
          $('#calc-standard-deviaton').html([
  String.raw`                \(S`,
  String.raw`                = \left.\sqrt{\dfrac{{\sum\limits_{i=1}^{n}}{\left(x_{i} - \bar{x}\right)^2}}{n-1}}\right.`,
  String.raw`                = \sqrt{${variance}}`,
  String.raw`                = ${standard_deviation}\)`,
          ].join('\n'));

          const zs = [];
          zs[n-1] = 0;

          for (var k = 0; (k < n); ++k) {
            zs[k] = devs[k]/standard_deviation;
            $form_data_x.eq(k).parent().next().next().next().html([
            String.raw`\(z_{${k}} = \dfrac{${devs[k]}}{${standard_deviation}}`,
            String.raw`= ${devs[k]/standard_deviation}\)`,
            ].join('\n'));
          }

          MathJax.Hub.Typeset();
        }

      });
