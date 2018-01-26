<script>
	import API from '../api/api.js'
	import Guide from './guide.vue'
	export default {
		data() {
			return {
				level1Project: [],
				level2Project: [],
				level1ProjectFormData: {
				    name: ''
				},
				level1ProjectFlag: false,
				level2ProjectFormData: {
					name: '',
					price: '',
					oncePrice: ''
				},
				level2ProjectFlag: false,
				currentLevel1ProjectPage: 1,
				computedLevel1ProjectIndex: 0,
				cardPageSize: 4,
				storeId: ''
			}
		},		
		methods: {
			showLevel2Project(index) {
				if(this.computedLevel1ProjectIndex != index) {
				    this.computedLevel1ProjectIndex = index;
				    this.getLevel2Project(this.computedLevel1ProjectIndex);
				}
			},
			guideClick(direction) {//  时间卡的
				if(direction === 'left') {
				    this.currentLevel1ProjectPage--;
				}else if(direction === 'right') {
				    this.currentLevel1ProjectPage++;
				}
				this.computedLevel1ProjectIndex = 0;
				this.getLevel2Project(this.computedLevel1ProjectIndex);
			},  
			getFirstList(projectListUrl, level1Project, level2Project) {
				let params;
				if(this.type == 'store') {// 在各个页面区分
					this.storeId = localStorage.getItem('storeId');
					params = {
						storeId: this.storeId
					}
				}else {
					this.companyId = localStorage.getItem('companyId');
					params = {
						companyId: this.companyId
					}
				}
				if(this.storeId || this.companyId) {
				    API.fetch(projectListUrl, params)
					    .then((data) => {
							this.level1Project = data[level1Project];
							this.level2Project = data[level2Project];
					    })
					    .catch((code) => {
					        Message(code)
					    })
				}        
			},
			getLevel2Project(newVal) {
				newVal = newVal || this.computedLevel1ProjectIndex;
				let index = (this.currentLevel1ProjectPage-1)*this.cardPageSize + newVal;
				let params;
				if(this.type == 'store') {
					params = {
					    storeId: this.storeId,
					    projectId: this.level1Project[index].projectId
					};
				}else {
					params = {
					    companyId: this.companyId,
					    id: this.level1Project[index].id
					};					
				}
				if(params.storeId || params.companyId) {
				    API.fetch(this.projectTwoListUrl, params)
					    .then((data) => {
					    	this.level2Project = data;
					    })
				}        
			},
			reset() {
				Object.keys(this.level1ProjectFormData).forEach((key) => {
				  this.level1ProjectFormData[key] = '';
				})
				Object.keys(this.level2ProjectFormData).forEach((key) => {
				  this.level2ProjectFormData[key] = '';
				})
				this.currentLevel1ProjectPage = 1;
				this.computedLevel1ProjectIndex = 0;        
			}			
		},
		computed: {
			isStart() {
				return this.currentLevel1ProjectPage  === 1;
			},
			isEnd() {
				let num = Math.ceil(this.level1Project.length/this.cardPageSize);
				num = num == 0 ? 1 : num;
				return this.currentLevel1ProjectPage === num;
			},    
			computedCards() {// 计算过的timecard
				this.computedLevel1ProjectIndex = 0;
				return this.level1Project.slice((this.currentLevel1ProjectPage - 1)*this.cardPageSize, this.currentLevel1ProjectPage*this.cardPageSize);
			}
	    },
		components: {
	        Guide
	    },	 
	    watch: {
	    	level2ProjectFlag(newVal) {
	    		if(!newVal) {
	    			this.reset();
	    		}
	    	},
			level1ProjectFlag(newVal) {
	    		if(!newVal) {
	    			this.reset();
	    		}
	    	}	    	
	    }   		
	}
</script>