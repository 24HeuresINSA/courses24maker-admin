<template>
  <div>
    <!--Main stats-->
    <div class="row">
      <div class="col-md-6 col-lg-4 col-xl-3">
        <stats-card>
          <div class="icon-big text-center" slot="header">
            <i class="ti-user"></i>
          </div>
          <div class="numbers" slot="content">
            <p>Participants</p>
            {{stats.participants_total}}
          </div>
        </stats-card>
      </div>
      <div class="col-md-6 col-lg-4 col-xl-3">
        <stats-card>
          <div class="icon-big text-center" slot="header">
            <i class="ti-hand-open"></i>
          </div>
          <div class="numbers" slot="content">
            <p>Teams</p>
            {{stats.teams_total}}
          </div>
        </stats-card>
      </div>
      <div class="col-md-6 col-lg-4 col-xl-3">
        <stats-card>
          <div class="icon-big text-center" slot="header">
            <i class="ti-money"></i>
          </div>
          <div class="numbers" slot="content">
            <p>Revenues</p>
            {{stats.revenues_expected}} €
          </div>
        </stats-card>
      </div>
      <div class="col-md-6 col-lg-4 col-xl-3">
        <stats-card>
          <div class="icon-big text-center" slot="header">
            <i class="ti-server"></i>
          </div>
          <div class="numbers" slot="content">
            <download-csv :data="exportDatabase" name="course24maker.csv'" style="display: inline-block">
              <button type="button" class="btn btn-sm m-1 btn-warning" @click="exportToCSV">Export data in CSV</button>
            </download-csv>
          </div>
        </stats-card>
      </div>
    </div>

    <!--Detailed stats-->
    <div class="row mb-4">
      <div style="overflow:auto" class="m-auto col-12">
        <table class="table mt-1" style="overflow-y:scroll">
          <thead style="color: white; backgroundColor: #2f6b98; textAlign: center">
            <th>Category</th>
            <th>Teams</th>
            <th>Participant</th>
            <th>Revenues</th>
          </thead>
          <tbody>
            <tr v-for="(item, index) in stats.categories_statistics_details" :key="index" :rowId="item.category_id" style="background-color: #fffcf4">
              <td style="white-space: nowrap;">{{item.category_label}}</td>
              <td style="white-space: nowrap;">{{item.category_teams_total}} |&nbsp;<b-badge variant="success">{{item.category_teams_valid}}</b-badge>&nbsp;<b-badge variant="primary">{{item.category_teams_to_check}}</b-badge>&nbsp;<b-badge variant="warning">{{item.category_teams_incomplete}}</b-badge>&nbsp;<b-badge variant="danger">{{item.category_teams_rejected}}</b-badge></td>
              <td style="white-space: nowrap;">{{item.category_participants_total}} |&nbsp;<b-badge variant="success">{{item.category_participants_complete}}</b-badge>&nbsp;<b-badge variant="warning">{{item.category_participants_incomplete}}</b-badge>
              <td style="white-space: nowrap;">{{item.category_revenues_expected}} |&nbsp;<b-badge variant="success">{{item.category_revenues_provided}}</b-badge>&nbsp;<b-badge variant="danger">{{item.category_revenues_missing}}</b-badge></td>
            </tr>
            <tr style="background-color: rgba(47,107,152,0.3)">
              <td>TOTAL</td>
              <td>{{stats.teams_total}} |&nbsp;<b-badge variant="success">{{stats.teams_valid}}</b-badge>&nbsp;<b-badge variant="primary">{{stats.teams_to_check}}</b-badge>&nbsp;<b-badge variant="warning">{{stats.teams_incomplete}}</b-badge>&nbsp;<b-badge variant="danger">{{stats.teams_rejected}}</b-badge></td>
              <td>{{stats.participants_total}} |&nbsp;<b-badge variant="success">{{stats.participants_complete}}</b-badge>&nbsp;<b-badge variant="warning">{{stats.participants_incomplete}}</b-badge>
              <td>{{stats.revenues_expected}} |&nbsp;<b-badge variant="success">{{stats.revenues_provided}}</b-badge>&nbsp;<b-badge variant="danger">{{stats.revenues_missing}}</b-badge></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="m-auto col-12">
        <div> Teams: Total registered |
          <i class="fa fa-circle text-success"></i> Validated
          <i class="fa fa-circle text-primary"></i> To check
          <i class="fa fa-circle text-warning"></i> Incomplete
          <i class="fa fa-circle text-danger"></i> Rejected <br>
          Participants: Total registered |
          <i class="fa fa-circle text-success"></i> Complete (payment, certificates)
          <i class="fa fa-circle text-warning"></i> Incomplete <br>
          Revenues: Total expected |
          <i class="fa fa-circle text-success"></i> Provided (validated)
          <i class="fa fa-circle text-danger"></i> Missing
        </div>
      </div>
    </div>


    <div class="row d-none">

      <div class="col-md-6 col-12">
        <chart-card title="Email Statistics"
                    sub-title="Last campaign performance"
                    :chart-data="statsCard"
                    chart-type="Pie">
          <div slot="legend">
            <i class="fa fa-circle text-info"></i> Open
            <i class="fa fa-circle text-danger"></i> Bounce
            <i class="fa fa-circle text-warning"></i> Unsubscribe
            <i class="fa fa-circle text-warning"></i> Unsubscribe
          </div>
        </chart-card>
      </div>

    </div>

  </div>
</template>
<script>
import { StatsCard, ChartCard } from "@/components/index";
import Chartist from 'chartist';
export default {
  components: {
    StatsCard,
    ChartCard
  },
  /**
   * Chart data used to render stats, charts. Should be replaced with server data
   */
  data() {
    return {
      stats: {},
      statsCard: {},
      exportDatabase: [],
    };
  },
  mounted() {
      this.axios.request({
          url: "/statistics",
          method: "get"
      })
      .then(result => {
          this.statsCard = {
              labels: ["Validated", "To check", "Incomplete", "Rejected"],
              series: [this.stats.teams_total, this.stats.teams_to_check, this.stats.teams_incomplete, this.stats.teams_rejected]
          },
          this.stats = result.data.statistics;
      });

      this.axios.request({
          url: "/statistics/export-database",
          method: "get"
      })
      .then(result => {
          this.exportDatabase = result.data.database;
      });
  },
  computed: {
      getStatsCard() {
          return {
              labels: ["Validated", "To check", "Incomplete", "Rejected"],
              series: [this.stats.teams_total, this.stats.teams_to_check, this.stats.teams_incomplete, this.stats.teams_rejected]
          };
      }
  },
  methods: {
      exportToCSV(){
      },
  }
};
</script>
<style>
</style>
